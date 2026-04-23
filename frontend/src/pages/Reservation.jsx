import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { restaurants } from "../mock";
import { ArrowLeft, Calendar, Users, Clock, Check, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { createReservation } from "../api/reservations";

function getBaseDate(offsetDays = 0) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offsetDays);
  return date;
}

const Reservation = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const r = restaurants.find(x => x.slug === slug);
  const [step, setStep] = useState(1);
  const dateOptions = useMemo(() => ([
    { label: "Ce soir", offsetDays: 0 },
    { label: "Demain", offsetDays: 1 },
    { label: "Dans 2 jours", offsetDays: 2 },
    { label: "Dans 3 jours", offsetDays: 3 }
  ]), []);
  const [selectedDateOffset, setSelectedDateOffset] = useState(0);
  const [time, setTime] = useState("20:00");
  const [guests, setGuests] = useState(2);
  const [accountUser, setAccountUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [createdReservation, setCreatedReservation] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");

    if (!token) {
      toast.error("Connecte-toi pour reserver ce restaurant.");
      navigate("/login", { replace: true });
      return;
    }

    if (!userRaw) {
      return;
    }

    try {
      setAccountUser(JSON.parse(userRaw));
    } catch (error) {
      setAccountUser(null);
    }
  }, [navigate]);

  const selectedDateLabel = dateOptions.find((option) => option.offsetDays === selectedDateOffset)?.label || "Date";

  if (!r) return <div className="pt-[140px] px-6 text-center">Restaurant introuvable</div>;

  const handleConfirm = async () => {
    try {
      setSubmitting(true);

      const reservationDate = getBaseDate(selectedDateOffset);
      const [hours, minutes] = time.split(":").map(Number);
      reservationDate.setHours(hours, minutes, 0, 0);

      const reservation = await createReservation({
        restaurantId: r.id,
        restaurantSlug: r.slug,
        reservationDate: reservationDate.toISOString(),
        partySize: guests
      });

      setCreatedReservation(reservation);
      setConfirmed(true);
      toast.success("Réservation confirmée !", {
        description: `${r.name} · ${selectedDateLabel} à ${time} · ${guests} personnes`
      });
    } catch (error) {
      toast.error(error.message || "Impossible de finaliser la réservation.");
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <div className="pt-[140px] min-h-screen max-w-2xl mx-auto px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-[#C8102E] mx-auto flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-white"/>
        </div>
        <h1 className="text-5xl font-bold mb-4">C'est confirmé !</h1>
        <p className="text-[#6B6B6B] text-lg">Tu as RDV chez <strong className="text-[#1A1A1A]">{r.name}</strong></p>
        <div className="bg-white rounded-3xl border border-[#EAE6DF] p-6 mt-8 text-left space-y-3">
          <div className="flex justify-between pb-3 border-b border-[#EAE6DF]"><span className="text-[#6B6B6B]">Date</span><span className="font-bold">{selectedDateLabel}</span></div>
          <div className="flex justify-between pb-3 border-b border-[#EAE6DF]"><span className="text-[#6B6B6B]">Heure</span><span className="font-bold">{time}</span></div>
          <div className="flex justify-between pb-3 border-b border-[#EAE6DF]"><span className="text-[#6B6B6B]">Convives</span><span className="font-bold">{guests} personnes</span></div>
          <div className="flex justify-between"><span className="text-[#6B6B6B]">Référence</span><span className="font-bold font-mono">{createdReservation?._id || `FORK-${Math.floor(Math.random()*999999)}`}</span></div>
        </div>
        <p className="text-sm text-[#6B6B6B] mt-6">Cette réservation est liée à ton compte {accountUser?.email || "utilisateur"}.</p>
        <div className="flex gap-3 justify-center mt-8">
          <Link to="/" className="btn-ghost">Retour à l'accueil</Link>
          <Link to="/my-reservations" className="btn-primary">Voir mes réservations</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[104px] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-semibold mb-6 hover:text-[#C8102E] transition-colors">
          <ArrowLeft className="w-4 h-4"/> Retour
        </button>
        <div className="text-xs tracking-[0.3em] uppercase text-[#C8102E] font-bold mb-3">Réservation</div>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">Réserver chez<br/><em className="text-gradient-red">{r.name}</em></h1>

        {/* Steps */}
        <div className="flex items-center gap-4 mt-10 mb-10">
          {[1,2,3].map(n => (
            <div key={n} className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= n ? "bg-[#C8102E] text-white" : "bg-white border-2 border-[#EAE6DF] text-[#6B6B6B]"}`}>{n}</div>
              <span className={`text-sm font-semibold hidden sm:block ${step >= n ? "text-[#1A1A1A]" : "text-[#6B6B6B]"}`}>
                {n === 1 ? "Date & heure" : n === 2 ? "Tes infos" : "Confirmation"}
              </span>
              {n < 3 && <ChevronRight className="w-4 h-4 text-[#6B6B6B]"/>}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-[#EAE6DF] p-8">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#6B6B6B] mb-3"><Calendar className="w-3.5 h-3.5"/>Date</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {dateOptions.map(option => (
                      <button key={option.label} onClick={()=>setSelectedDateOffset(option.offsetDays)} className={`p-4 rounded-xl border-2 text-sm font-semibold transition-colors ${selectedDateOffset===option.offsetDays ? "border-[#C8102E] bg-[#FFE8ED] text-[#C8102E]" : "border-[#EAE6DF] hover:border-[#1A1A1A]"}`}>{option.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#6B6B6B] mb-3"><Users className="w-3.5 h-3.5"/>Convives</label>
                  <div className="flex gap-2 flex-wrap">
                    {[1,2,3,4,5,6,7,8].map(n => (
                      <button key={n} onClick={()=>setGuests(n)} className={`w-12 h-12 rounded-xl border-2 font-bold transition-colors ${guests===n ? "border-[#C8102E] bg-[#C8102E] text-white" : "border-[#EAE6DF] hover:border-[#1A1A1A]"}`}>{n}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#6B6B6B] mb-3"><Clock className="w-3.5 h-3.5"/>Heure</label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {["19:00","19:30","20:00","20:30","21:00","21:30"].map(t => (
                      <button key={t} onClick={()=>setTime(t)} className={`py-3 rounded-xl border-2 text-sm font-semibold transition-colors ${time===t ? "border-[#C8102E] bg-[#FFE8ED] text-[#C8102E]" : "border-[#EAE6DF] hover:border-[#1A1A1A]"}`}>{t}</button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="btn-primary w-full justify-center inline-flex items-center gap-2">Continuer <ChevronRight className="w-4 h-4"/></button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-[#EAE6DF] p-5 bg-[#FAF8F4] space-y-3">
                  <p className="text-sm font-semibold text-[#1A1A1A]">Vos informations de compte seront utilisées automatiquement :</p>
                  <div className="text-sm text-[#6B6B6B]">
                    <div><span className="font-semibold text-[#1A1A1A]">Prénom:</span> {accountUser?.profile?.firstName || "-"}</div>
                    <div><span className="font-semibold text-[#1A1A1A]">Nom:</span> {accountUser?.profile?.lastName || "-"}</div>
                    <div><span className="font-semibold text-[#1A1A1A]">Email:</span> {accountUser?.email || "-"}</div>
                    <div><span className="font-semibold text-[#1A1A1A]">Identifiant:</span> @{accountUser?.username || "-"}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-ghost flex-1">Retour</button>
                  <button onClick={() => setStep(3)} className="btn-primary flex-1">Continuer</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Vérifie les détails</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-3 border-b border-[#EAE6DF]"><span className="text-[#6B6B6B]">Restaurant</span><span className="font-bold">{r.name}</span></div>
                  <div className="flex justify-between py-3 border-b border-[#EAE6DF]"><span className="text-[#6B6B6B]">Date</span><span className="font-bold">{selectedDateLabel}</span></div>
                  <div className="flex justify-between py-3 border-b border-[#EAE6DF]"><span className="text-[#6B6B6B]">Heure</span><span className="font-bold">{time}</span></div>
                  <div className="flex justify-between py-3 border-b border-[#EAE6DF]"><span className="text-[#6B6B6B]">Convives</span><span className="font-bold">{guests}</span></div>
                  <div className="flex justify-between py-3 border-b border-[#EAE6DF]"><span className="text-[#6B6B6B]">Au nom de</span><span className="font-bold">{accountUser?.profile?.firstName || ""} {accountUser?.profile?.lastName || ""}</span></div>
                  <div className="flex justify-between py-3"><span className="text-[#6B6B6B]">Contact</span><span className="font-bold">{accountUser?.email || "-"}</span></div>
                </div>
                <div className="bg-[#FFE8ED] p-4 rounded-xl text-sm text-[#1A1A1A]">
                  Annulation gratuite jusqu'à 24h avant. Un no-show entraîne des frais de 50€/personne.
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="btn-ghost flex-1">Retour</button>
                  <button onClick={handleConfirm} disabled={submitting} className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed">{submitting ? "Confirmation..." : "Confirmer la réservation"}</button>
                </div>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="bg-white rounded-3xl border border-[#EAE6DF] overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={r.image} alt={r.name} className="w-full h-full object-cover"/>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold">{r.name}</h3>
                <p className="text-sm text-[#6B6B6B] mt-1">{r.chef} · {r.city}</p>
                <div className="flex items-center gap-2 mt-3">
                  {r.stars > 0 && [...Array(r.stars)].map((_,i) => <span key={i} className="text-[#C8102E]">★</span>)}
                  <span className="text-sm text-[#6B6B6B]">{r.priceRange}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-[#EAE6DF] text-sm">
                  <div className="flex justify-between mb-1"><span className="text-[#6B6B6B]">Menu dégustation</span><span className="font-bold">€{r.price}/pers.</span></div>
                  <div className="flex justify-between"><span className="text-[#6B6B6B]">Pour {guests}</span><span className="font-bold">€{r.price * guests}</span></div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
