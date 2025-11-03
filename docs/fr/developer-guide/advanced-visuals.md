# Composants Visuels Avancés (WebGL)

L'application Mood possède une identité visuelle unique et très dynamique, alimentée par des shaders WebGL personnalisés dont le rendu est géré via `react-three-fiber` et `ogl`. Il ne s'agit pas de composants React standards, mais de véritables applications graphiques intégrées à l'interface utilisateur.

## Technologie Fondamentale

- **`react-three-fiber` / `ogl`** : Ces bibliothèques servent de pont entre React et WebGL, nous permettant de gérer un canevas WebGL et sa scène en utilisant une syntaxe déclarative basée sur des composants.
- **GLSL (OpenGL Shading Language)** : La logique visuelle elle-même est écrite en GLSL. Un **shader** est un petit programme qui s'exécute directement sur le GPU. Nous utilisons un `vertexShader` pour définir la forme (un simple plan) et un `fragmentShader` pour calculer la couleur de chaque pixel de cette forme, créant ainsi des motifs animés et complexes.

---

## Le Composant `Silk`

`Silk` est l'arrière-plan animé et génératif utilisé dans tout le tableau de bord d'administration et sur la page racine.

- **Fichier** : `src/components/Silk.tsx`
- **Fonctionnalité** : Il effectue le rendu d'un plan en plein écran et applique un fragment shader personnalisé pour créer un motif fluide, semblable à de la soie.
- **Props** : Il est hautement configurable via des props (`speed`, `scale`, `color`, `noiseIntensity`), qui sont passées directement au shader en tant qu'`uniforms`.
- **Transition de Couleur** : Le shader est conçu pour interpoler linéairement (`lerp`) en douceur de sa couleur actuelle vers une nouvelle couleur cible. C'est ce qui se produit lors du changement de thème dans le tableau de bord.

### `SilkContext`

- **Fichier** : `src/app/admin/SilkContext.tsx`
- **Objectif** : Le tableau de bord a besoin de pouvoir changer la couleur de l'arrière-plan `Silk` depuis des composants enfants (par exemple, au survol d'un graphique). Ce Contexte React expose une fonction `setSilkColor`, qui est fournie au niveau du `admin/layout.tsx` et permet à n'importe quel composant enfant de commander un changement de couleur.

### `PollSilk`

- **Fichier** : `src/components/PollSilk.tsx`
- **Objectif** : Il s'agit d'une version légèrement spécialisée et moins configurable de `Silk`, utilisée sur la page de sondage publique. Ses paramètres sont principalement fixes pour un aspect cohérent, et il accepte simplement une prop `color` pour effectuer la transition entre les couleurs des humeurs.

---

## Le Composant `FaultyTerminal`

Ce composant crée l'effet de terminal rétro et défaillant visible sur la page "Sondage Fermé".

- **Fichier** : `src/components/FaultyTerminal.tsx`
- **Technologie** : Il utilise `ogl`, une bibliothèque WebGL plus petite et de plus bas niveau, pour une performance maximale.
- **Fonctionnalité** : Similaire à `Silk`, il exécute un fragment shader complexe qui simule les artéfacts visuels d'un vieil écran cathodique, incluant :
  - Des motifs de chiffres génératifs
  - Des lignes de balayage (scanlines)
  - Une courbure de l'écran (distorsion en barillet)
  - De l'aberration chromatique
  - Des effets de scintillement et de "glitch"
- **Interactivité** : Il est configuré pour réagir au mouvement de la souris (`mouseReact`), déformant subtilement le motif lorsque le curseur de l'utilisateur se déplace sur le canevas, ajoutant une couche d'interactivité immersive.
- **Importation Dynamique** : C'est un composant graphiquement intensif. Pour optimiser les performances, il est chargé dynamiquement uniquement lorsque nécessaire sur la page `poll/closed/client-page.tsx` en utilisant `next/dynamic` avec `ssr: false`.
