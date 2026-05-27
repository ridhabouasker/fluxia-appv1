@AGENTS.md

# FluxIA — Instructions projet

## Contexte
Plateforme B2B de pré-comptabilité. Deux types d'utilisateurs : **cabinet comptable** (admin) et **client** (dépose des documents). Solo developer + Claude.

## Stack
- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- Supabase (auth + DB + storage)
- Déployé sur Vercel

## Charte graphique — NE PAS DÉVIER
- Fond : `#FFFFFF`
- Fond doux : `#F8FAFC`
- Bordures : `#E2E8F0`
- Texte principal : `#0F172A`
- Texte secondaire : `#64748B`
- Texte faint : `#94A3B8`
- Accent (logo, nav active, CTA, pagination) : `#1D4ED8`
- Boutons secondaires : ghost blanc + bordure grise
- Statuts : couleur sémantique uniquement (vert `#059669` / ambre `#D97706` / rouge `#DC2626`)
- Font : Inter
- Référence maquette : `/Users/ridhabouasker/Desktop/fluxia-final.html`

## Structure des fichiers
```
app/
  (auth)/         → login, register
  (dashboard)/    → espace cabinet
  (client)/       → portail client
components/       → composants UI réutilisables
lib/
  supabaseClient.ts
  utils.ts
```

## Règles de code
- TypeScript strict — pas de `any`
- Composants en arrow functions exportées
- Pas de commentaires sauf si la logique est non-évidente
- Pas de `console.log` en production
- RLS Supabase obligatoire sur chaque table
- ENUM `user_role` : `firm` / `customer` / `master`

## Règles de collaboration
- Ne jamais éditer, commiter ou pousser sans un "Go" explicite
- Une feature à la fois
- Toujours lire un fichier avant de le modifier
- Ne jamais créer de fichiers inutiles (README, docs non demandés)

## Conventions de nommage SQL
- `id` → réservé aux clés primaires internes (UUID)
- `ref` → pour les identifiants externes (ex: `tax_ref_main`, `tax_ref_vat`)
- Ne jamais utiliser `_id` pour un identifiant externe

## Ce qu'on ne fait PAS
- Pas de mock de la base de données pour les tests
- Pas de `any` TypeScript
- Pas de couleurs en dehors de la charte
- Pas de push GitHub sans demande explicite
