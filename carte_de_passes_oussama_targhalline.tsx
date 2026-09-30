import React, { useState, useMemo } from 'react';

export default function PassMap() {
  const [seed, setSeed] = useState(0);

  // Dimensions du terrain (proportions standard 105x68m)
  const PITCH_WIDTH = 1050;
  const PITCH_HEIGHT = 680;

  const passes = useMemo(() => {
    // Utilisation d'une fonction pseudo-aléatoire simple basée sur le seed pour le bouton "Régénérer"
    const random = () => Math.random();
    const newPasses = [];

    // 1. Passes vers l'avant (Bleu) : Progression de la Droite vers la Gauche (X diminue)
    // Quantité : ~65 passes selon les notes de l'image
    for (let i = 0; i < 65; i++) {
      const startX = 400 + random() * 400; // Milieu et moitié défensive
      const startY = 100 + random() * 480; // Répartition sur la largeur
      
      // Fin de la passe : X est forcément plus petit (vers la gauche)
      const endX = startX - (60 + random() * 250); 
      const endY = startY + (random() * 200 - 100);
      
      newPasses.push({ 
        x1: startX, y1: startY, x2: endX, y2: endY, 
        color: '#3b82f6', // Bleu
        id: `blue-${i}` 
      });
    }

    // 2. Passes vers l'arrière (Noir) : De la Gauche vers la Droite (X augmente)
    // Quantité : ~35 passes
    for (let i = 0; i < 35; i++) {
      const startX = 200 + random() * 500;
      const startY = 100 + random() * 480;
      
      // Fin de la passe : X est forcément plus grand (vers la droite)
      const endX = startX + (40 + random() * 150); 
      const endY = startY + (random() * 150 - 75);
      
      newPasses.push({ 
        x1: startX, y1: startY, x2: endX, y2: endY, 
        color: '#111827', // Noir très foncé
        id: `black-${i}` 
      });
    }

    // 3. Passes latérales (Vert) : Circulation haut/bas, X bouge très peu
    // Quantité : ~35 passes
    for (let i = 0; i < 35; i++) {
      const startX = 250 + random() * 500;
      const startY = 150 + random() * 380;
      
      // Fin de la passe : X bouge très peu (+/- 20), Y bouge beaucoup
      const endX = startX + (random() * 40 - 20); 
      let endY = startY + (random() > 0.5 ? 1 : -1) * (60 + random() * 200);
      
      // Garder sur le terrain
      endY = Math.max(20, Math.min(PITCH_HEIGHT - 20, endY)); 
      
      newPasses.push({ 
        x1: startX, y1: startY, x2: endX, y2: endY, 
        color: '#10b981', // Vert émeraude
        id: `green-${i}` 
      });
    }

    // 4. Passe ratée (Rouge) : La grande transversale visible sur l'image
    newPasses.push({ 
      x1: 650, y1: 340, x2: 150, y2: 360, 
      color: '#ef4444', 
      id: 'red-1' 
    });

    return newPasses;
  }, [seed]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 font-sans flex flex-col items-center">
      
      <div className="max-w-5xl w-full">
        {/* En-tête */}
        <div className="mb-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-wide">
            Carte de Passes : Oussama Targhalline
          </h1>
          <p className="text-gray-400 mt-2 font-medium">
            Sens du jeu : <span className="text-white">DROITE vers GAUCHE</span> (Attaque vers le but gauche)
          </p>
        </div>

        {/* Bouton de génération */}
        <div className="flex justify-center mb-6">
          <button 
            onClick={() => setSeed(s => s + 1)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-colors shadow-lg"
          >
            Générer une nouvelle configuration
          </button>
        </div>

        {/* Conteneur du terrain */}
        <div className="relative w-full border-4 border-gray-700 rounded-lg overflow-hidden shadow-2xl bg-[#397245]">
          <svg 
            viewBox={`0 0 ${PITCH_WIDTH} ${PITCH_HEIGHT}`} 
            className="w-full h-auto drop-shadow-md"
            style={{ display: 'block' }}
          >
            {/* Définition des têtes de flèches */}
            <defs>
              <marker id="arrow-blue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="#3b82f6" />
              </marker>
              <marker id="arrow-black" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="#111827" />
              </marker>
              <marker id="arrow-green" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="#10b981" />
              </marker>
              <marker id="arrow-red" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="#ef4444" />
              </marker>
            </defs>

            {/* Lignes du terrain (Blanc transparent) */}
            <g stroke="#ffffff" strokeOpacity="0.5" strokeWidth="3" fill="none">
              {/* Ligne médiane */}
              <line x1={PITCH_WIDTH / 2} y1="0" x2={PITCH_WIDTH / 2} y2={PITCH_HEIGHT} />
              {/* Cercle central */}
              <circle cx={PITCH_WIDTH / 2} cy={PITCH_HEIGHT / 2} r="91.5" />
              {/* Point central */}
              <circle cx={PITCH_WIDTH / 2} cy={PITCH_HEIGHT / 2} r="4" fill="#ffffff" strokeOpacity="0.8" />
              
              {/* Surfaces de réparation */}
              <rect x="0" y="138.5" width="165" height="403" />
              <rect x={PITCH_WIDTH - 165} y="138.5" width="165" height="403" />
              
              {/* Surfaces de but */}
              <rect x="0" y="248.5" width="55" height="183" />
              <rect x={PITCH_WIDTH - 55} y="248.5" width="55" height="183" />

              {/* Points de penalty */}
              <circle cx="110" cy={PITCH_HEIGHT / 2} r="3" fill="#ffffff" strokeOpacity="0.8" />
              <circle cx={PITCH_WIDTH - 110} cy={PITCH_HEIGHT / 2} r="3" fill="#ffffff" strokeOpacity="0.8" />
            </g>

            {/* Rendu des passes */}
            {passes.map(pass => {
              let markerId = '';
              if (pass.color === '#3b82f6') markerId = 'url(#arrow-blue)';
              else if (pass.color === '#111827') markerId = 'url(#arrow-black)';
              else if (pass.color === '#10b981') markerId = 'url(#arrow-green)';
              else if (pass.color === '#ef4444') markerId = 'url(#arrow-red)';

              return (
                <line 
                  key={pass.id}
                  x1={pass.x1} 
                  y1={pass.y1} 
                  x2={pass.x2} 
                  y2={pass.y2}
                  stroke={pass.color}
                  strokeWidth="3.5"
                  strokeOpacity="0.85"
                  markerEnd={markerId}
                  className="transition-all duration-500 ease-in-out"
                />
              );
            })}
            
            {/* Flèche indiquant le sens du jeu en bas (comme l'original) */}
            <g transform="translate(100, 640)">
               <line x1="150" y1="0" x2="0" y2="0" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.7" markerEnd="url(#arrow-green)" />
            </g>
          </svg>
        </div>

        {/* Légende */}
        <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-inner grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-1 bg-blue-500 rounded"></div>
            <span><strong className="text-blue-400">BLEU :</strong> Passes vers l'avant (~65)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-1 bg-green-500 rounded"></div>
            <span><strong className="text-green-400">VERT :</strong> Passes latérales (~35)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-1 bg-black border border-gray-600 rounded"></div>
            <span><strong className="text-gray-300">NOIR :</strong> Passes vers l'arrière (~35)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-1 bg-red-500 rounded"></div>
            <span><strong className="text-red-400">ROUGE :</strong> Passe ratée (1)</span>
          </div>
        </div>
        
      </div>
    </div>
  );
}