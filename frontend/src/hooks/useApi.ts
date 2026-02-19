import { useState, useEffect } from 'react';
import type { Team, PlayerData, Format, Role } from '../types/cricket';

const API = '/api';

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/teams`)
      .then(r => r.json())
      .then(d => setTeams(d.teams))
      .finally(() => setLoading(false));
  }, []);

  return { teams, loading };
}

export function usePlayers(team: string, format: Format | '', role: Role | '') {
  const [players, setPlayers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!team || !format || !role) { setPlayers([]); return; }
    setLoading(true);
    fetch(`${API}/players?team=${encodeURIComponent(team)}&format=${format}&role=${role}`)
      .then(r => r.json())
      .then(d => setPlayers(d.players || []))
      .catch(() => setPlayers([]))
      .finally(() => setLoading(false));
  }, [team, format, role]);

  return { players, loading };
}

export function usePlayerData(name: string, format: Format | '', role: Role | '') {
  const [data, setData] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!name || !format || !role) { setData(null); return; }
    setLoading(true);
    setError(null);
    fetch(`${API}/player?name=${encodeURIComponent(name)}&format=${format}&role=${role}`)
      .then(r => {
        if (!r.ok) throw new Error(`Player data not found`);
        return r.json();
      })
      .then(d => setData(d))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [name, format, role]);

  return { data, loading, error };
}
