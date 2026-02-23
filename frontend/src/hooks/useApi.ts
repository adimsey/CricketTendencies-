import { useState, useEffect, useRef } from 'react';
import type { Team, PlayerData, Format, Role } from '../types/cricket';

export interface SearchResult {
  name: string;
  team: string;
  format: string;
  role: string;
}

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

export function usePlayerSearch(q: string, format: Format | '', role: Role | '') {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!q || q.length < 2) { setResults([]); return; }

    timerRef.current = setTimeout(() => {
      setLoading(true);
      const params = new URLSearchParams({ q });
      if (format) params.set('format', format);
      if (role) params.set('role', role);
      fetch(`${API}/search?${params}`)
        .then(r => r.json())
        .then(d => setResults(d.results || []))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [q, format, role]);

  return { results, loading };
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
