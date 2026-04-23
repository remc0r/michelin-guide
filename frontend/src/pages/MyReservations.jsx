import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useReservations } from '../hooks/useReservations';
import { createReview, getReviewByReservation } from '../api/reviews';

const MAX_REVIEW_IMAGES = 4;
const createDefaultReviewDraft = () => ({ rating: 5, comment: '', images: [] });

const formatReservationDate = (value) => {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
};

const STATUS_LABELS = {
  confirmed: 'Confirmee',
  completed: 'Terminee',
  cancelled: 'Annulee'
};

const MyReservationsPage = () => {
  const { reservations, loading, error, loadReservations, updateStatus } = useReservations();
  const [reviewsByReservationId, setReviewsByReservationId] = useState({});
  const [reviewDrafts, setReviewDrafts] = useState({});
  const [submittingReviewFor, setSubmittingReviewFor] = useState(null);
  const [updatingStatusFor, setUpdatingStatusFor] = useState(null);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  useEffect(() => {
    let cancelled = false;

    const loadExistingReviews = async () => {
      const completedReservations = reservations.filter((reservation) => reservation.status === 'completed');

      if (completedReservations.length === 0) {
        if (!cancelled) {
          setReviewsByReservationId({});
        }
        return;
      }

      const entries = await Promise.all(
        completedReservations.map(async (reservation) => {
          try {
            const review = await getReviewByReservation(reservation._id);
            return [reservation._id, review];
          } catch (reviewError) {
            return [reservation._id, null];
          }
        })
      );

      if (!cancelled) {
        setReviewsByReservationId(Object.fromEntries(entries));
      }
    };

    loadExistingReviews();

    return () => {
      cancelled = true;
    };
  }, [reservations]);

  const sortedReservations = useMemo(() => {
    return [...reservations].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [reservations]);

  const handleCompleteReservation = async (reservation) => {
    try {
      setUpdatingStatusFor(reservation._id);
      await updateStatus(reservation._id, 'completed');
      await loadReservations();
      toast.success('Reservation marquee comme terminee.');
    } catch (updateError) {
      toast.error(updateError.message || 'Impossible de mettre a jour la reservation.');
    } finally {
      setUpdatingStatusFor(null);
    }
  };

  const handleDraftChange = (reservationId, field, value) => {
    setReviewDrafts((prev) => ({
      ...prev,
      [reservationId]: {
        ...(prev[reservationId] || createDefaultReviewDraft()),
        [field]: value
      }
    }));
  };

  const handleDraftImagesChange = (reservationId, files) => {
    const selectedFiles = Array.from(files || []).slice(0, MAX_REVIEW_IMAGES);

    if ((files || []).length > MAX_REVIEW_IMAGES) {
      toast.error(`Vous pouvez ajouter jusqu'a ${MAX_REVIEW_IMAGES} images.`);
    }

    handleDraftChange(reservationId, 'images', selectedFiles);
  };

  const handleSubmitReview = async (reservationId) => {
    const draft = reviewDrafts[reservationId] || createDefaultReviewDraft();

    try {
      setSubmittingReviewFor(reservationId);
      const newReview = await createReview({
        reservationId,
        rating: Number(draft.rating),
        comment: draft.comment,
        images: draft.images || []
      });

      setReviewsByReservationId((prev) => ({
        ...prev,
        [reservationId]: newReview
      }));
      setReviewDrafts((prev) => ({
        ...prev,
        [reservationId]: createDefaultReviewDraft()
      }));
      toast.success('Avis enregistre avec succes.');
    } catch (reviewError) {
      toast.error(reviewError.message || 'Impossible de publier cet avis.');
    } finally {
      setSubmittingReviewFor(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-20">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-black mb-2">Mes reservations</h1>
          <p className="text-gray-600 mb-8">
            Retrouvez vos reservations et laissez un avis apres votre visite.
          </p>

          {loading && <p className="text-gray-600">Chargement des reservations...</p>}
          {error && <p className="text-red-600 mb-4">{error}</p>}

          {!loading && sortedReservations.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-gray-700 mb-4">Vous n'avez pas encore de reservation.</p>
              <Link
                to="/restaurants"
                className="inline-flex px-4 py-2 rounded-lg bg-[#C91818] text-white font-medium hover:bg-red-700 transition-colors"
              >
                Decouvrir des restaurants
              </Link>
            </div>
          )}

          <div className="space-y-4">
            {sortedReservations.map((reservation) => {
              const reservationReview = reviewsByReservationId[reservation._id];
              const draft = reviewDrafts[reservation._id] || createDefaultReviewDraft();

              return (
                <div key={reservation._id} className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex flex-wrap gap-2 items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-black">{reservation.restaurantSlug}</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatReservationDate(reservation.reservationDate)} · {reservation.partySize} convive(s)
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                      {STATUS_LABELS[reservation.status] || reservation.status}
                    </span>
                  </div>

                  {reservation.status === 'confirmed' && (
                    <div className="mt-4">
                      <button
                        onClick={() => handleCompleteReservation(reservation)}
                        disabled={updatingStatusFor === reservation._id}
                        className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-60"
                      >
                        {updatingStatusFor === reservation._id ? 'Mise a jour...' : 'Marquer comme terminee'}
                      </button>
                    </div>
                  )}

                  {reservation.status === 'completed' && (
                    <div className="mt-4 border-t border-gray-100 pt-4">
                      {reservationReview ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-sm text-green-700 font-medium mb-1">Avis deja publie</p>
                          <p className="text-sm text-gray-800">Note: {reservationReview.rating}/5</p>
                          {reservationReview.comment && (
                            <p className="text-sm text-gray-700 mt-1">{reservationReview.comment}</p>
                          )}
                          {Array.isArray(reservationReview.imageUrls) && reservationReview.imageUrls.length > 0 && (
                            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                              {reservationReview.imageUrls.map((imageUrl) => (
                                <img
                                  key={imageUrl}
                                  src={imageUrl}
                                  alt="Photo de l'avis"
                                  className="h-20 w-full rounded-md object-cover border border-green-100"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700">Note</label>
                          <select
                            value={draft.rating}
                            onChange={(event) => handleDraftChange(reservation._id, 'rating', event.target.value)}
                            className="w-full md:w-40 border border-gray-300 rounded-lg px-3 py-2"
                          >
                            {[5, 4, 3, 2, 1].map((value) => (
                              <option key={value} value={value}>
                                {value}/5
                              </option>
                            ))}
                          </select>

                          <label className="block text-sm font-medium text-gray-700">Commentaire</label>
                          <textarea
                            value={draft.comment}
                            onChange={(event) => handleDraftChange(reservation._id, 'comment', event.target.value)}
                            rows={3}
                            maxLength={200}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            placeholder="Partagez votre experience..."
                          />

                          <label className="block text-sm font-medium text-gray-700">
                            Photos ({(draft.images || []).length}/{MAX_REVIEW_IMAGES})
                          </label>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            multiple
                            onChange={(event) => handleDraftImagesChange(reservation._id, event.target.files)}
                            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                          />
                          {(draft.images || []).length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {(draft.images || []).map((file) => (
                                <div
                                  key={`${file.name}-${file.lastModified}`}
                                  className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-md px-2 py-1 truncate"
                                >
                                  {file.name}
                                </div>
                              ))}
                            </div>
                          )}

                          <button
                            onClick={() => handleSubmitReview(reservation._id)}
                            disabled={submittingReviewFor === reservation._id}
                            className="px-4 py-2 rounded-lg bg-[#C91818] text-white hover:bg-red-700 disabled:opacity-60"
                          >
                            {submittingReviewFor === reservation._id ? 'Publication...' : 'Publier mon avis'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyReservationsPage;

