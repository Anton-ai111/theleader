export interface LawDefinition {
  id: string;
  title: string;
  description: string;
  type: 'CIVIL' | 'ECONOMIC' | 'MILITARY' | 'POLITICAL' | 'ENVIRONMENT';
  effectDescription: string;
}

export const LAW_TEMPLATES: LawDefinition[] = [
  // --- CIVIL & POLITICAL ---
  { 
    id: 'free_speech', 
    title: 'Freedom of Speech', 
    description: 'Guarantees freedom of press and expression for all citizens.', 
    type: 'CIVIL',
    effectDescription: 'Approval++, Liberty++, Stability--'
  },
  { 
    id: 'state_media', 
    title: 'State Media Control', 
    description: 'The government regulates all news and media outlets.', 
    type: 'POLITICAL',
    effectDescription: 'Stability++, Approval--, Liberty--'
  },
  { 
    id: 'surveillance_act', 
    title: 'Mass Surveillance Act', 
    description: 'Extensive government monitoring of digital communications.', 
    type: 'POLITICAL',
    effectDescription: 'Stability++, Liberty--, Approval-'
  },
  { 
    id: 'closed_borders', 
    title: 'Closed Borders', 
    description: 'Strict control over immigration and travel.', 
    type: 'POLITICAL',
    effectDescription: 'Stability+, Nationalism+, Economy--'
  },
  { 
    id: 'death_penalty', 
    title: 'Capital Punishment', 
    description: 'Allow the state to execute criminals for serious offenses.', 
    type: 'CIVIL',
    effectDescription: 'Stability+, Approval+/- (Split), HumanRights--'
  },
  { 
    id: 'gun_rights', 
    title: 'Civilian Gun Ownership', 
    description: 'Allows citizens to own firearms for defense.', 
    type: 'CIVIL',
    effectDescription: 'Liberty+, Stability--, CrimeRisk+'
  },

  // --- ECONOMIC ---
  { 
    id: 'universal_healthcare', 
    title: 'Universal Healthcare', 
    description: 'State-funded healthcare system for all citizens.', 
    type: 'ECONOMIC',
    effectDescription: 'Approval++, Stability+, Economy--'
  },
  { 
    id: 'private_healthcare', 
    title: 'Privatized Healthcare', 
    description: 'Healthcare is managed by private corporations.', 
    type: 'ECONOMIC',
    effectDescription: 'Economy++, Approval--, Inequality+'
  },
  { 
    id: 'wealth_tax', 
    title: 'Progressive Wealth Tax', 
    description: 'High taxes on the ultra-wealthy to fund social programs.', 
    type: 'ECONOMIC',
    effectDescription: 'Approval+, Economy-, EliteSupport--'
  },
  { 
    id: 'corporate_tax_cuts', 
    title: 'Corporate Deregulation', 
    description: 'Slash taxes and regulations for big business.', 
    type: 'ECONOMIC',
    effectDescription: 'Economy++, Approval--, Pollution+'
  },
  { 
    id: 'labor_unions', 
    title: 'Labor Union Rights', 
    description: 'Protects the right of workers to organize and strike.', 
    type: 'ECONOMIC',
    effectDescription: 'Approval+, Economy--, Equality+'
  },

  // --- MILITARY ---
  { 
    id: 'martial_law', 
    title: 'Martial Law', 
    description: 'Military takes control of justice and public order.', 
    type: 'MILITARY',
    effectDescription: 'Stability+++, Approval---, Liberty---'
  },
  { 
    id: 'conscription', 
    title: 'Mandatory Conscription', 
    description: 'All eligible citizens must serve in the military.', 
    type: 'MILITARY',
    effectDescription: 'Military++, Approval--, Workforce--'
  },
  { 
    id: 'nuclear_deterrence', 
    title: 'Nuclear Deterrence Policy', 
    description: 'Maintain an active nuclear arsenal standby.', 
    type: 'MILITARY',
    effectDescription: 'Military+++, GlobalTension++, SanctionRisk+'
  },

  // --- ENVIRONMENT & EDUCATION ---
  { 
    id: 'green_energy', 
    title: 'Green Energy Mandate', 
    description: 'Transition economy to renewable energy sources.', 
    type: 'ENVIRONMENT',
    effectDescription: 'Approval+, Economy- (Short term), Future+'
  },
  { 
    id: 'industrial_expansion', 
    title: 'Unchecked Industry', 
    description: 'Remove environmental protections to boost factory output.', 
    type: 'ENVIRONMENT',
    effectDescription: 'Economy++, Approval--, Health--'
  },
  { 
    id: 'compulsory_education', 
    title: 'State Education Mandate', 
    description: 'Strict curriculum control and mandatory schooling.', 
    type: 'CIVIL',
    effectDescription: 'Stability+, Economy+ (Long term), Indoctrination+'
  }
];