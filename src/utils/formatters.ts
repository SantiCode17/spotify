/**
 * Formatea duración de segundos a "m:ss"
 */
export const formatDuration = (seconds?: number): string => {
  if (!seconds) return '';
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
};

/**
 * Formatea duración de segundos a "X min"
 */
export const formatDurationMin = (seconds?: number): string => {
  if (!seconds) return '';
  return `${Math.floor(seconds / 60)} min`;
};

/**
 * Formatea una fecha ISO a "dd/mm/yyyy"
 */
export const formatDate = (isoDate?: string): string => {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

/**
 * Formatea número de reproducciones con separadores de miles
 */
export const formatPlays = (plays?: number): string => {
  if (!plays) return '0';
  return plays.toLocaleString('es-ES');
};

/**
 * Obtiene iniciales de un nombre para avatar
 */
export const getInitials = (name?: string): string => {
  if (!name) return '?';
  return name
    .split(/[\s_-]+/)
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};
