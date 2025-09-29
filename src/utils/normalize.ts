export const normalize = (s: string) =>
  s
    .normalize('NFD')                      // separa acentos
    .replace(/[\u0300-\u036f]/g, '')       // elimina tildes
    .replace(/ñ/g, 'n')                    // reemplaza ñ → n
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-');                 // espacios → guiones
