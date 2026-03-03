import type { Exercise } from '../types'

export const exercises: Exercise[] = [
  // Peito
  { id: 'bench-press', name: 'Supino Reto', muscleGroup: 'chest', equipment: 'barbell', description: 'Deite no banco reto, desça a barra até o peito e empurre para cima.' },
  { id: 'incline-bench-press', name: 'Supino Inclinado', muscleGroup: 'chest', equipment: 'barbell', description: 'Supino em banco inclinado para trabalhar a parte superior do peitoral.' },
  { id: 'dumbbell-fly', name: 'Crucifixo com Halteres', muscleGroup: 'chest', equipment: 'dumbbell', description: 'Deite no banco, abra os braços com halteres e junte novamente.' },
  { id: 'cable-crossover', name: 'Crossover no Cabo', muscleGroup: 'chest', equipment: 'cable', description: 'Puxe os cabos de cima para baixo em movimento de abraço.' },
  { id: 'push-up', name: 'Flexão de Braço', muscleGroup: 'chest', equipment: 'bodyweight', description: 'Flexão clássica no chão trabalhando peito e tríceps.' },

  // Costas
  { id: 'deadlift', name: 'Levantamento Terra', muscleGroup: 'back', equipment: 'barbell', description: 'Eleve a barra do chão até a altura do quadril mantendo as costas retas.' },
  { id: 'barbell-row', name: 'Remada com Barra', muscleGroup: 'back', equipment: 'barbell', description: 'Incline o tronco e puxe a barra até o abdômen.' },
  { id: 'lat-pulldown', name: 'Puxada na Polia', muscleGroup: 'back', equipment: 'cable', description: 'Puxe a barra até o peito contraindo o dorsal.' },
  { id: 'pull-up', name: 'Barra Fixa', muscleGroup: 'back', equipment: 'bodyweight', description: 'Suspenda-se na barra e suba até o queixo ultrapassá-la.' },
  { id: 'seated-cable-row', name: 'Remada Baixa no Cabo', muscleGroup: 'back', equipment: 'cable', description: 'Sente-se e puxe o cabo em direção ao torso.' },

  // Ombros
  { id: 'overhead-press', name: 'Desenvolvimento com Barra', muscleGroup: 'shoulders', equipment: 'barbell', description: 'Pressione a barra acima da cabeça a partir da altura dos ombros.' },
  { id: 'lateral-raise', name: 'Elevação Lateral', muscleGroup: 'shoulders', equipment: 'dumbbell', description: 'Eleve os halteres lateralmente até a altura dos ombros.' },
  { id: 'front-raise', name: 'Elevação Frontal', muscleGroup: 'shoulders', equipment: 'dumbbell', description: 'Eleve os halteres à frente até a altura dos ombros.' },
  { id: 'face-pull', name: 'Face Pull', muscleGroup: 'shoulders', equipment: 'cable', description: 'Puxe a corda em direção ao rosto contraindo os deltoides posteriores.' },

  // Bíceps
  { id: 'barbell-curl', name: 'Rosca Bíceps com Barra', muscleGroup: 'biceps', equipment: 'barbell', description: 'Curve a barra do quadril até a altura dos ombros.' },
  { id: 'dumbbell-curl', name: 'Rosca Bíceps com Halteres', muscleGroup: 'biceps', equipment: 'dumbbell', description: 'Rosca com halteres alternada ou simultânea.' },
  { id: 'hammer-curl', name: 'Rosca Martelo', muscleGroup: 'biceps', equipment: 'dumbbell', description: 'Rosca com pegada neutra trabalhando o braquial.' },
  { id: 'cable-curl', name: 'Rosca Bíceps no Cabo', muscleGroup: 'biceps', equipment: 'cable', description: 'Rosca na polia para tensão constante.' },

  // Tríceps
  { id: 'tricep-pushdown', name: 'Extensão de Tríceps na Polia', muscleGroup: 'triceps', equipment: 'cable', description: 'Empurre a barra do cabo para baixo estendendo os cotovelos.' },
  { id: 'skull-crusher', name: 'Tríceps Testa', muscleGroup: 'triceps', equipment: 'barbell', description: 'Deite e desça a barra até a testa, depois estenda.' },
  { id: 'overhead-tricep-extension', name: 'Extensão de Tríceps Acima da Cabeça', muscleGroup: 'triceps', equipment: 'dumbbell', description: 'Segure um halter acima da cabeça e desça atrás dela.' },
  { id: 'dips', name: 'Paralelas', muscleGroup: 'triceps', equipment: 'bodyweight', description: 'Desça o corpo nas barras paralelas e empurre de volta.' },

  // Quadríceps
  { id: 'squat', name: 'Agachamento', muscleGroup: 'quads', equipment: 'barbell', description: 'Coloque a barra nas costas, agache e suba.' },
  { id: 'leg-press', name: 'Leg Press', muscleGroup: 'quads', equipment: 'machine', description: 'Empurre a plataforma usando as pernas.' },
  { id: 'leg-extension', name: 'Extensão de Pernas', muscleGroup: 'quads', equipment: 'machine', description: 'Estenda as pernas contra o suporte para trabalhar o quadríceps.' },
  { id: 'bulgarian-split-squat', name: 'Agachamento Búlgaro', muscleGroup: 'quads', equipment: 'dumbbell', description: 'Agachamento unilateral com o pé traseiro elevado em um banco.' },

  // Isquiotibiais
  { id: 'romanian-deadlift', name: 'Levantamento Terra Romeno', muscleGroup: 'hamstrings', equipment: 'barbell', description: 'Articule o quadril com leve flexão dos joelhos, descendo a barra.' },
  { id: 'leg-curl', name: 'Flexão de Pernas', muscleGroup: 'hamstrings', equipment: 'machine', description: 'Curve o suporte em direção aos glúteos deitado de bruços.' },
  { id: 'nordic-curl', name: 'Curl Nórdico', muscleGroup: 'hamstrings', equipment: 'bodyweight', description: 'Ajoelhe-se e desça o tronco lentamente controlando com os isquiotibiais.' },

  // Glúteos
  { id: 'hip-thrust', name: 'Hip Thrust', muscleGroup: 'glutes', equipment: 'barbell', description: 'Apoie as costas em um banco e empurre o quadril para cima com a barra.' },
  { id: 'glute-bridge', name: 'Ponte de Glúteo', muscleGroup: 'glutes', equipment: 'bodyweight', description: 'Deite de costas e eleve o quadril contraindo os glúteos.' },
  { id: 'cable-kickback', name: 'Extensão de Glúteo no Cabo', muscleGroup: 'glutes', equipment: 'cable', description: 'Chute a perna para trás contra a resistência do cabo.' },

  // Panturrilha
  { id: 'standing-calf-raise', name: 'Elevação de Panturrilha em Pé', muscleGroup: 'calves', equipment: 'machine', description: 'Suba na ponta dos pés na máquina de panturrilha.' },
  { id: 'seated-calf-raise', name: 'Elevação de Panturrilha Sentado', muscleGroup: 'calves', equipment: 'machine', description: 'Suba na ponta dos pés sentado com peso sobre os joelhos.' },

  // Core
  { id: 'plank', name: 'Prancha', muscleGroup: 'core', equipment: 'bodyweight', description: 'Mantenha a posição de flexão nos antebraços com o corpo reto.' },
  { id: 'hanging-leg-raise', name: 'Elevação de Pernas Suspenso', muscleGroup: 'core', equipment: 'bodyweight', description: 'Suspenda-se na barra e eleve as pernas a 90 graus.' },
  { id: 'cable-crunch', name: 'Crunch no Cabo', muscleGroup: 'core', equipment: 'cable', description: 'Ajoelhe-se e flexione o tronco contra a resistência do cabo.' },
  { id: 'ab-wheel-rollout', name: 'Roda Abdominal', muscleGroup: 'core', equipment: 'bodyweight', description: 'Role a roda para frente de joelhos e puxe de volta.' },

  // Cardio
  { id: 'treadmill-run', name: 'Corrida na Esteira', muscleGroup: 'cardio', equipment: 'machine', description: 'Corra na esteira em ritmo contínuo ou em intervalos.' },
  { id: 'jump-rope', name: 'Corda de Pular', muscleGroup: 'cardio', equipment: 'bodyweight', description: 'Pule continuamente sobre a corda para condicionamento cardiorrespiratório.' },
  { id: 'rowing-machine', name: 'Remada no Ergômetro', muscleGroup: 'cardio', equipment: 'machine', description: 'Reme no ergômetro para um cardio de corpo inteiro.' },
]
