import { useState, useEffect, useCallback } from 'react';
import { getReservations, createReservation, getReservation, updateReservationStatus } from '../api/reservations';

export const useReservations = (statusFilter = null) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadReservations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReservations(statusFilter);
      setReservations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  const handleCreateReservation = useCallback(async (reservationData) => {
    try {
      setError(null);
      const newReservation = await createReservation(reservationData);
      setReservations(prev => [newReservation, ...prev]);
      return newReservation;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const handleGetReservation = useCallback(async (reservationId) => {
    try {
      setError(null);
      const reservation = await getReservation(reservationId);
      return reservation;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const handleUpdateStatus = useCallback(async (reservationId, newStatus) => {
    try {
      setError(null);
      const updatedReservation = await updateReservationStatus(reservationId, newStatus);
      setReservations(prev =>
        prev.map(res =>
          res._id === reservationId ? updatedReservation : res
        )
      );
      return updatedReservation;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    reservations,
    loading,
    error,
    loadReservations,
    createReservation: handleCreateReservation,
    getReservation: handleGetReservation,
    updateStatus: handleUpdateStatus
  };
};

export const useSingleReservation = (reservationId) => {
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadReservation = useCallback(async () => {
    if (!reservationId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getReservation(reservationId);
      setReservation(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [reservationId]);

  useEffect(() => {
    loadReservation();
  }, [loadReservation]);

  return {
    reservation,
    loading,
    error,
    refresh: loadReservation
  };
};