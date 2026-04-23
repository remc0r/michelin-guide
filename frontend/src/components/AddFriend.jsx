import React, { useState } from 'react';
import { UserPlus, Search, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const AddFriend = ({ onSendRequest }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setError('Veuillez entrer un nom d\'utilisateur');
      return;
    }

    if (username.trim() === localStorage.getItem('user')?.username) {
      setError('Vous ne pouvez pas vous ajouter vous-même');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSendRequest(username.trim());
      setUsername('');
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-black mb-2">
          Ajouter des amis
        </h2>
        <p className="text-gray-600 mb-6">
          Entrez le nom d\'utilisateur de la personne que vous souhaitez ajouter
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              className="pl-10 h-12 text-base"
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base"
            disabled={loading || !username.trim()}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Envoi en cours...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Envoyer une demande
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-black mb-2">
            Comment trouver des amis ?
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Demandez le nom d'utilisateur à vos amis</li>
            <li>• Partagez votre nom d'utilisateur : <span className="font-mono bg-white px-2 py-1 rounded border">
              {localStorage.getItem('user')?.username || 'votre_nom_d_utilisateur'}
            </span></li>
            <li>• Vos amis doivent vous envoyer une demande d'ami</li>
          </ul>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note :</strong> Une fois amis, vous pourrez voir leurs activités de restaurant dans votre fil d'activité.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddFriend;