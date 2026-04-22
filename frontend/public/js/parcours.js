/* global window, document, localStorage, navigator, fetch */

/**
 * Parcours Personnalisé — injection DOM (sans React).
 * Les composants React existants ne sont pas modifiés: on s'accroche au DOM.
 */

(function () {

  /**
   * Crée un élément DOM.
   * @param {string} tag
   * @param {Record<string, any>=} attrs
   * @param {Array<Node|string>=} children
   * @returns {HTMLElement}
   */
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach((k) => {
        if (k === "class") node.className = attrs[k];
        else if (k === "dataset") {
          Object.assign(node.dataset, attrs[k]);
        } else if (k === "text") {
          node.textContent = attrs[k];
        } else if (k.startsWith("on") && typeof attrs[k] === "function") {
          node.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
        } else {
          node.setAttribute(k, String(attrs[k]));
        }
      });
    }
    (children || []).forEach((c) => {
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  /**
   * Convertit un nombre d'étoiles en affichage ★.
   * @param {number} n
   * @returns {string}
   */
  function starString(n) {
    const count = Math.max(0, Math.min(5, Number(n) || 0));
    return "★".repeat(count);
  }

  /**
   * Essaie de récupérer une ville via géolocalisation et un reverse-geocoding simple.
   * Sans API tierce: on utilise le champ locality si disponible via navigateur (rare).
   * Fallback: chaîne vide.
   * @returns {Promise<string>}
   */
  function guessCityFromGeolocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve("");
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            // Sans API externe, on ne peut pas faire de reverse-geocoding fiable.
            // On propose donc une saisie manuelle; cette fonction reste un best-effort.
            void pos;
            resolve("");
          } catch (e) {
            resolve("");
          }
        },
        () => resolve(""),
        { timeout: 2500 }
      );
    });
  }

  /**
   * Insère la bannière sous la nav (au mieux) sinon en haut de #root.
   * @param {() => void} onCreateParcours
   */
  function mountInlineCta(onCreateParcours) {
    const host = document.getElementById("mg-parcours-inline");
    if (!host) return;

    const block = el("div", { class: "mg-parcours-inline", role: "region" }, [
      el("div", { class: "mg-parcours-inline__left" }, [
        el("div", { class: "mg-parcours-inline__kicker", text: "Parcours personnalisé" }),
        el("div", {
          class: "mg-parcours-inline__text",
          text: "Laissez-nous composer votre table d'aujourd'hui ?",
        }),
      ]),
      el("div", { class: "mg-parcours-inline__actions" }, [
        el(
          "button",
          {
            class: "mg-parcours-primary-btn",
            type: "button",
            onclick: () => onCreateParcours(),
          },
          ["Créer mon parcours"]
        ),
      ]),
    ]);

    host.appendChild(block);
  }

  /**
   * Construit et monte la modal/wizard.
   * @returns {{open: () => void}}
   */
  function createWizard() {
    /** @type {{step:1|2|3|4, withWho:string, placeMode:'ville'|'voyage'|'', city:string, moment:string}} */
    const state = {
      step: 1,
      withWho: "",
      placeMode: "",
      city: "",
      moment: "",
    };

    const modal = el("div", { class: "mg-parcours-modal", "aria-hidden": "true" });
    const panel = el("div", { class: "mg-parcours-modal__panel", role: "dialog", "aria-modal": "true" });
    const top = el("div", { class: "mg-parcours-modal__top" }, [
      el("h2", { class: "mg-parcours-modal__title", text: "Parcours personnalisé" }),
      el(
        "button",
        {
          class: "mg-parcours-modal__close",
          type: "button",
          "aria-label": "Fermer",
          onclick: () => close(),
        },
        ["✕"]
      ),
    ]);
    const content = el("div", { class: "mg-parcours-modal__content" });
    panel.appendChild(top);
    panel.appendChild(content);
    modal.appendChild(panel);
    document.body.appendChild(modal);

    /** @type {{backBtn: HTMLButtonElement|null, nextBtn: HTMLButtonElement|null, nextLabel: HTMLSpanElement|null}|null} */
    let navRefs = null;

    /**
     * Ouvre la modal.
     */
    function open() {
      modal.classList.add("mg-parcours-modal--open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      render();
    }

    /**
     * Ferme la modal.
     */
    function close() {
      modal.classList.remove("mg-parcours-modal--open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    /**
     * Réinitialise l'état.
     */
    function reset() {
      state.step = 1;
      state.withWho = "";
      state.placeMode = "";
      state.city = "";
      state.moment = "";
    }

    /**
     * Rend une card d'option.
     * @param {{id:string, icon:string, label:string, selected:boolean, onSelect:() => void}} opt
     * @returns {HTMLElement}
     */
    function optionCard(opt) {
      const card = el(
        "div",
        {
          class: "mg-parcours-card" + (opt.selected ? " mg-parcours-card--selected" : ""),
          role: "button",
          tabindex: "0",
        },
        [
          el("div", { class: "mg-parcours-card__icon", text: opt.icon }),
          el("div", { class: "mg-parcours-card__label", text: opt.label }),
        ]
      );
      card.addEventListener("click", opt.onSelect);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          opt.onSelect();
        }
      });
      return card;
    }

    /**
     * Appelle l'API backend pour récupérer des recommandations.
     * @returns {Promise<any>}
     */
    async function fetchParcours() {
      const qs = new URLSearchParams({
        city: state.city,
        group_type: state.placeMode === "voyage" ? "voyage" : "ville",
        moment: state.moment,
      }).toString();

      // 1) Tentative relative (proxy CRA si configuré)
      const relativeUrl = `/api/parcours?${qs}`;
      let resp = await fetch(relativeUrl, { method: "GET" });

      // 2) Fallback dev: appel direct du backend
      if (!resp.ok) {
        const directUrl = `http://localhost:8000/api/parcours?${qs}`;
        resp = await fetch(directUrl, { method: "GET" });
      }

      if (!resp.ok) throw new Error("Impossible de charger les recommandations");
      return resp.json();
    }

    /**
     * Rendu step 1.
     */
    function renderStep1() {
      content.appendChild(el("h3", { class: "mg-parcours-step-title", text: "Avec qui ?" }));
      content.appendChild(
        el("p", {
          class: "mg-parcours-step-subtitle",
          text: "Choisissez le contexte pour ajuster la sélection.",
        })
      );

      const grid = el("div", { class: "mg-parcours-grid" });
      const opts = [
        { id: "seul", icon: "🧍", label: "Seul(e)" },
        { id: "couple", icon: "👫", label: "En couple" },
        { id: "amis", icon: "👯", label: "Entre amis" },
        { id: "famille", icon: "👨‍👩‍👧", label: "En famille" },
      ];
      opts.forEach((o) => {
        grid.appendChild(
          optionCard({
            id: o.id,
            icon: o.icon,
            label: o.label,
            selected: state.withWho === o.id,
            onSelect: () => {
              state.withWho = o.id;
              render();
              updateNav();
            },
          })
        );
      });
      content.appendChild(grid);
      content.appendChild(renderNav());
      updateNav();
    }

    /**
     * Rendu step 2.
     */
    function renderStep2() {
      content.appendChild(el("h3", { class: "mg-parcours-step-title", text: "Où ?" }));
      content.appendChild(
        el("p", {
          class: "mg-parcours-step-subtitle",
          text: "Dans votre ville, ou pour un voyage — avec suggestions d'hôtels.",
        })
      );

      const grid = el("div", { class: "mg-parcours-grid" });
      const opts = [
        { id: "ville", icon: "📍", label: "Dans ma ville" },
        { id: "voyage", icon: "✈️", label: "Voyage" },
      ];
      opts.forEach((o) => {
        grid.appendChild(
          optionCard({
            id: o.id,
            icon: o.icon,
            label: o.label,
            selected: state.placeMode === o.id,
            onSelect: () => {
              state.placeMode = /** @type {'ville'|'voyage'} */ (o.id);
              // On reste sur l'étape 2 pour permettre la saisie de la ville.
              render();
              updateNav();
            },
          })
        );
      });
      content.appendChild(grid);

      const form = el("div", { class: "mg-parcours-form" });
      const input = el("input", {
        class: "mg-parcours-input",
        placeholder:
          state.placeMode === "voyage"
            ? "Ville de destination (ex: Tokyo)"
            : "Votre ville (ex: Paris)",
        value: state.city,
        type: "text",
      });
      input.addEventListener("input", () => {
        state.city = input.value;
        updateNav();
      });
      form.appendChild(input);

      const hint = el("div", {
        class: "mg-parcours-step-subtitle",
        text:
          "Astuce: Paris, Lyon, Bordeaux, Nice, Tokyo (données mockées).",
      });
      form.appendChild(hint);

      if (state.placeMode === "ville") {
        const geoBtn = el(
          "button",
          { class: "mg-parcours-secondary-btn", type: "button" },
          ["Utiliser ma position (optionnel)"]
        );
        geoBtn.addEventListener("click", async () => {
          geoBtn.disabled = true;
          const guessed = await guessCityFromGeolocation();
          if (guessed) {
            state.city = guessed;
            input.value = guessed;
          }
          geoBtn.disabled = false;
        });
        form.appendChild(geoBtn);
      }

      content.appendChild(form);
      content.appendChild(renderNav());
      updateNav();
    }

    /**
     * Rendu step 3.
     */
    function renderStep3() {
      content.appendChild(el("h3", { class: "mg-parcours-step-title", text: "Quel moment ?" }));
      content.appendChild(
        el("p", {
          class: "mg-parcours-step-subtitle",
          text: "Sélectionnez l'ambiance pour accorder la recommandation.",
        })
      );

      const grid = el("div", { class: "mg-parcours-grid" });
      const opts = [
        { id: "dejeuner", icon: "🌅", label: "Déjeuner" },
        { id: "diner", icon: "🌙", label: "Dîner" },
        { id: "occasion", icon: "🎉", label: "Grande occasion" },
        { id: "degustation", icon: "🍷", label: "Dégustation" },
      ];
      opts.forEach((o) => {
        grid.appendChild(
          optionCard({
            id: o.id,
            icon: o.icon,
            label: o.label,
            selected: state.moment === o.id,
            onSelect: () => {
              state.moment = o.id;
              render();
              updateNav();
            },
          })
        );
      });
      content.appendChild(grid);
      content.appendChild(renderNav());
      updateNav();
    }

    /**
     * Calcule si l'utilisateur peut avancer depuis l'étape courante.
     * @returns {boolean}
     */
    function canGoNext() {
      if (state.step === 1) return Boolean(state.withWho);
      if (state.step === 2) return Boolean(state.placeMode) && Boolean(state.city.trim());
      if (state.step === 3) return Boolean(state.moment);
      return false;
    }

    /**
     * Met à jour l'état (disabled + label) des boutons Retour/Suivant.
     */
    function updateNav() {
      if (!navRefs || !navRefs.backBtn || !navRefs.nextBtn || !navRefs.nextLabel) return;
      navRefs.backBtn.disabled = state.step === 1;
      navRefs.nextBtn.disabled = !canGoNext();
      navRefs.nextLabel.textContent = state.step === 3 ? "Voir les résultats" : "Suivant";
    }

    /**
     * Crée une carte résultat restaurant/hôtel.
     * @param {{type:'restaurant'|'hotel', item:any}} params
     * @returns {HTMLElement}
     */
    function resultCard(params) {
      const item = params.item;
      const isRestaurant = params.type === "restaurant";
      const title = item.name;
      const stars = isRestaurant ? starString(item.stars) : starString(item.stars_hotel);
      const meta = isRestaurant
        ? `${item.cuisine} • ${item.city} • ${item.price_range}`
        : `${item.city} • Hôtel ${item.stars_hotel}★`;

      return el("div", { class: "mg-parcours-result-card" }, [
        el("img", {
          class: "mg-parcours-result-card__img",
          alt: title,
          src: item.imageUrl,
          loading: "lazy",
        }),
        el("div", { class: "mg-parcours-result-card__body" }, [
          el("h4", { class: "mg-parcours-result-card__name", text: title }),
          el("div", { class: "mg-parcours-stars", text: stars }),
          el("p", { class: "mg-parcours-meta", text: meta }),
          el("p", { class: "mg-parcours-desc", text: item.description }),
          el(
            "button",
            { class: "mg-parcours-primary-btn mg-parcours-cta", type: "button" },
            ["Réserver"]
          ),
        ]),
      ]);
    }

    /**
     * Rendu step 4 (résultats), via API.
     */
    async function renderStep4() {
      content.appendChild(el("h3", { class: "mg-parcours-step-title", text: "Résultats" }));
      content.appendChild(
        el("p", {
          class: "mg-parcours-step-subtitle",
          text: `Sélection pour ${state.city} — ${state.placeMode === "voyage" ? "Voyage" : "Dans ma ville"}.`,
        })
      );

      const loading = el("p", {
        class: "mg-parcours-step-subtitle",
        text: "Nous composons votre parcours…",
      });
      content.appendChild(loading);

      try {
        const data = await fetchParcours();
        loading.remove();

        const results = el("div", { class: "mg-parcours-results" });
        (data.restaurants || []).forEach((r) => results.appendChild(resultCard({ type: "restaurant", item: r })));

        if ((data.hotels || []).length > 0) {
          content.appendChild(el("div", { class: "mg-parcours-divider" }));
          content.appendChild(
            el("h3", { class: "mg-parcours-step-title", text: "Hôtels recommandés" })
          );
          const hotelsGrid = el("div", { class: "mg-parcours-results" });
          data.hotels.forEach((h) => hotelsGrid.appendChild(resultCard({ type: "hotel", item: h })));
          content.appendChild(hotelsGrid);
        }

        content.appendChild(results);

        const actions = el("div", { class: "mg-parcours-actions" }, [
          el(
            "button",
            {
              class: "mg-parcours-secondary-btn",
              type: "button",
              onclick: () => {
                reset();
                render();
              },
            },
            ["Refaire ma sélection"]
          ),
          el(
            "button",
            {
              class: "mg-parcours-primary-btn",
              type: "button",
              onclick: () => close(),
            },
            ["Fermer"]
          ),
        ]);
        content.appendChild(actions);
      } catch (e) {
        loading.textContent =
          "Impossible de charger les résultats. Vérifiez que le backend est démarré.";
        content.appendChild(
          el(
            "button",
            {
              class: "mg-parcours-secondary-btn",
              type: "button",
              onclick: () => render(),
            },
            ["Réessayer"]
          )
        );
      }
    }

    /**
     * Rend la navigation (Retour / Suivant).
     * @param {{canNext:boolean}} params
     * @returns {HTMLElement}
     */
    function renderNav() {
      // Crée la nav une seule fois par render(). Les refs permettent de mettre à jour disabled sans recréer.
      const nav = el("div", { class: "mg-parcours-actions" });

      const backBtn = /** @type {HTMLButtonElement} */ (
        el(
          "button",
          {
            class: "mg-parcours-secondary-btn",
            type: "button",
            onclick: () => {
              state.step = /** @type {any} */ (Math.max(1, state.step - 1));
              render();
            },
          },
          ["Retour"]
        )
      );

      const nextLabel = /** @type {HTMLSpanElement} */ (el("span", { text: "Suivant" }));
      const nextBtn = /** @type {HTMLButtonElement} */ (
        el(
          "button",
          {
            class: "mg-parcours-primary-btn",
            type: "button",
            onclick: () => {
              if (!canGoNext()) return;
              state.step = /** @type {any} */ (Math.min(4, state.step + 1));
              render();
            },
          },
          [nextLabel]
        )
      );

      navRefs = { backBtn, nextBtn, nextLabel };
      nav.appendChild(backBtn);
      nav.appendChild(nextBtn);
      return nav;
    }

    /**
     * Rendu principal.
     */
    function render() {
      content.innerHTML = "";
      navRefs = null;

      if (state.step === 1) renderStep1();
      else if (state.step === 2) renderStep2();
      else if (state.step === 3) renderStep3();
      else {
        // step 4
        void renderStep4();
      }

      updateNav();
    }

    // Click sur overlay pour fermer (optionnel, plutôt discret)
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });
    window.addEventListener("keydown", (e) => {
      if (modal.classList.contains("mg-parcours-modal--open") && e.key === "Escape") {
        close();
      }
    });

    return { open };
  }

  // Boot
  window.addEventListener("DOMContentLoaded", () => {
    const wizard = createWizard();
    mountInlineCta(() => wizard.open());
  });
})();

