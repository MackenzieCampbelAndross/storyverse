import { StoryBook } from '../types';

export const QUANTUM_HORIZON: StoryBook = {
  id: 'book_quantum_horizon',
  title: 'The Quantum Horizon',
  author: 'Mackenzie Campbell Andross',
  genre: 'SCI_FI',
  synopsis: 'Docked at an abandoned research station in the rings of Saturn, you must restore the containment field before anomalous gravity rips the station apart.',
  initialStats: {
    health: 100,
    sanity: 90,
    credits: 500,
    reputation: 10,
  },
  initialInventory: ['Scanner Omni-Tool', 'Emergency Patch Kit'],
  rootNodeId: 'node_airlock',
  achievements: [
    { id: 'ach_first_choice', title: 'Into the Void', description: 'Cross the airlock into the derelict station.', icon: '🚀' },
    { id: 'ach_engineer', title: 'Chief Engineer', description: 'Successfully stabilize the antimatter containment reactor.', icon: '⚛️' },
    { id: 'ach_survivor', title: 'Sole Survivor', description: 'Escape the decaying orbit in a pristine scout craft.', icon: '🏆' },
    { id: 'ach_curious', title: 'Data Archaeologist', description: 'Decrypt the hidden log entries of the station director.', icon: '💾' },
  ],
  nodes: {
    node_airlock: {
      id: 'node_airlock',
      title: 'Airlock Delta-4',
      visualMood: 'space_station',
      content: `The atmospheric pressure stabilizes with a low mechanical hiss. Frost clings to the reinforced glass of your helmet visor. Beyond the inner seal lies the desolate main corridor of Station Horizon. Ambient emergency lights bathe the ribbed bulkheads in a slow, rhythmic amber pulse. Your Geiger counter clicks intermittently—the magnetic containment field is leaking somewhere deep within the lower decks.`,
      choices: [
        {
          id: 'c_to_bridge',
          text: 'Ascend the service lift toward the Command Bridge to reboot the central telemetry.',
          targetNodeId: 'node_bridge',
          reward: { unlockAchievement: 'ach_first_choice' },
        },
        {
          id: 'c_to_engineering',
          text: 'Venture downward through the coolant conduits directly into Engineering.',
          targetNodeId: 'node_engineering',
          reward: { unlockAchievement: 'ach_first_choice' },
        },
        {
          id: 'c_search_lockers',
          text: 'Rummage through the breached maintenance lockers in the airlock staging bay.',
          targetNodeId: 'node_lockers',
        },
      ],
    },
    node_lockers: {
      id: 'node_lockers',
      title: 'Equipment Staging Bay',
      visualMood: 'space_station',
      content: `Prying open the warped titanium locker door, you uncover an unspent Magnetic Grapple and an Officer Security Keycard stamped with Level-3 authorization. A portable audio memo clicks to life: "If you are hearing this, the singularity drive has collapsed. Do not trust the AI guidance system."`,
      choices: [
        {
          id: 'c_take_gear_to_bridge',
          text: 'Pocket the Keycard and take the elevator up to the Command Bridge.',
          targetNodeId: 'node_bridge',
          reward: { addItem: 'Level-3 Security Keycard', statChanges: { sanity: -5 } },
        },
        {
          id: 'c_take_gear_to_reactor',
          text: 'Head directly to the Lower Engineering bay with the security card.',
          targetNodeId: 'node_engineering',
          reward: { addItem: 'Level-3 Security Keycard' },
        },
      ],
    },
    node_bridge: {
      id: 'node_bridge',
      title: 'Command Bridge',
      visualMood: 'space_station',
      content: `The bridge is a panoramic glass dome looking directly into the glittering ice debris of Saturn\'s rings. Consoles spark violently. The central holographic interface, labeled AURA, flickers into view: "Commander detected. Structural integrity at 24%. Divert remaining auxiliary power to thrusters or reactor shields?"`,
      choices: [
        {
          id: 'c_divert_reactor',
          text: 'Divert power to the antimatter containment shields.',
          targetNodeId: 'node_reactor_shielded',
          reward: { setFlag: 'shields_active', unlockAchievement: 'ach_curious' },
        },
        {
          id: 'c_decrypt_logs',
          text: 'Use the Level-3 Keycard to decrypt the classified director terminal.',
          targetNodeId: 'node_director_secret',
          condition: { requiredItem: 'Level-3 Security Keycard' },
        },
        {
          id: 'c_escape_pods',
          text: 'Bypass the terminals and rush down the emergency chute to the Escape Pod bay.',
          targetNodeId: 'node_escape_bay',
        },
      ],
    },
    node_director_secret: {
      id: 'node_director_secret',
      title: 'Director\'s Private Log Archive',
      visualMood: 'space_station',
      content: `The terminal decrypts: "The anomaly was not a containment failure. It is a spatial fold. We have successfully retrieved an artifact from the event horizon." The coordinates for an experimental hyper-drive shuttle docked in Hangar 9 are revealed!`,
      choices: [
        {
          id: 'c_to_hangar_shuttle',
          text: 'Sprint to Hangar 9 to pilot the hyper-drive vessel.',
          targetNodeId: 'node_hangar_shuttle',
          reward: { addItem: 'Hyper-Drive Coordinates', statChanges: { reputation: 20 } },
        },
      ],
    },
    node_engineering: {
      id: 'node_engineering',
      title: 'Lower Engineering Reactor',
      visualMood: 'space_station',
      content: `Gravity here is warped—every step feels heavy, then weightless. The core is a pulsing miniature pulsar suspended in mid-air. Warning sirens scream as plasma leaks through a ruptured magnetic solenoid. You need to manually align the coolant rods or seal the containment hatch.`,
      choices: [
        {
          id: 'c_align_rods',
          text: 'Use your Scanner Omni-Tool to precisely align the superconducting rods.',
          targetNodeId: 'node_reactor_saved',
          condition: { minStat: 70, stat: 'health' },
          reward: { statChanges: { health: -15 }, unlockAchievement: 'ach_engineer' },
        },
        {
          id: 'c_seal_chamber',
          text: 'Trigger the emergency blast door, sacrificing the reactor to save the station superstructure.',
          targetNodeId: 'node_escape_bay',
          reward: { statChanges: { sanity: -20 } },
        },
      ],
    },
    node_reactor_shielded: {
      id: 'node_reactor_shielded',
      title: 'Containment Core Stabilized',
      visualMood: 'space_station',
      content: `The auxiliary power kicks in with a deafening roar. Blue cerenkov radiation fades back into the magnetic core. The gravitational shuddering halts completely. Station Horizon is saved from plunging into Saturn.`,
      isEnding: true,
      endingType: 'VICTORY',
      choices: [],
    },
    node_reactor_saved: {
      id: 'node_reactor_saved',
      title: 'Engineering Triumph',
      visualMood: 'space_station',
      content: `Despite thermal burns through your suit layers, you lock the final magnetic solenoid in place. The core settles into a purring equilibrium. You broadcast your distress beacon across the Solar system—help will arrive within hours.`,
      isEnding: true,
      endingType: 'VICTORY',
      choices: [],
    },
    node_hangar_shuttle: {
      id: 'node_hangar_shuttle',
      title: 'The Prototype Vessel',
      visualMood: 'space_station',
      content: `You ignite the prototype hyper-drive engines. The derelict station falls away behind you like a speck of dust against the violet gas bands of Saturn. You are charting the first human interstellar jump in history.`,
      isEnding: true,
      endingType: 'VICTORY',
      choices: [],
    },
    node_escape_bay: {
      id: 'node_escape_bay',
      title: 'Escape Pod Ejection',
      visualMood: 'space_station',
      content: `You strap yourself into pod 04. Explosive bolts detonate, launching you clear of Station Horizon just as its auxiliary solar arrays fracture. You drift safely toward the outer patrol beacons.`,
      isEnding: true,
      endingType: 'MYSTERIOUS',
      choices: [],
    },
  },
};

export const STORY_CATALOG: StoryBook[] = [
  QUANTUM_HORIZON,
];
