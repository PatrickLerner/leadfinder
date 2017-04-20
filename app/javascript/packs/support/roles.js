const roles = [
  {
    title: {
      de: 'Owner',
      en: 'Owner'
    },
    values: {
      de: [[
        'Owner', 'Founder', 'CEO', 'Chief Executive Officer', 'Founder & CEO', 'Partner',
        'Geschäftsführer',  'Managing Director', 'Managing Partner', 'Vorstand',
        'Vorstandsvorsitzender', 'Inhaber'
      ]],
      en: [['Owner', 'Founder', 'CEO', 'Chief Executive Officer', 'Founder & CEO', 'Partner']]
    }
  },
  {
    title: {
      de: 'Marketing Manager',
      en: 'Marketing Manager'
    },
    values: {
      de: [[
        'Marketing Manager', 'Director of Marketing', 'CMO', 'Chief Marketing Officer',
        'Vice President of Marketing', 'VP of Marketing', 'VP Marketing', 'Marketingleiter',
        'Head of Marketing', 'Head of SEO', 'Head of Performance Marketing', 'Head of SEA',
        'Creative Director', 'Brandmanager'
      ]],
      en: [[
        'Marketing Manager', 'Director of Marketing', 'CMO', 'Chief Marketing Officer',
        'Vice President of Marketing', 'VP of Marketing', 'VP Marketing'
      ]]
    }
  },
  {
    title: {
      de: 'Sales Manager',
      en: 'Sales Manager'
    },
    values: {
      en: [[
        'Sales manager', 'Business Development Manager', 'Sales Director', 'Director of Sales',
        'Head of Sales', 'Sales Executive', 'Sales representative', 'Head of Business development',
        'Territory manager', 'VP of Sales', 'Verkaufsleiter', 'Vertriebsleiter', 'CSO', 'Chief Sales Officer',
        'VP Sales', 'Abteilungsleiter Vertrieb', 'Teamlead Sales', 'Teamleiter Sales', 'Teamleiter Vertrieb',
        'Bezirksleiter', 'Regional Manager', 'Gebietsleiter', 'Area Manager', 'Regionalleiter',
        'District Manager', 'Key Account manager'
      ]],
      en: [[
        'Sales Manager', 'Business Development Manager', 'Sales Director', 'Director of Sales',
        'Head of Sales', 'VP Sales', 'VP of Sales'
      ]]
    }
  },
  {
    title: {
      de: 'Opertions Manager',
      en: 'Opertions Manager'
    },
    values: {
      de: [[
        'Operations Manager', 'COO', 'Chief Operations Officer', 'Director of Operations', 'VP Operations',
        'Vice President of Operations', 'Head of Operations', 'Operativer Geschäftsführer', 'Abteilungsleiter',
        'Operatives Geschäft'
      ]],
      en: [[
        'Operations Manager', 'COO', 'Chief Operations Officer', 'Director of Operations', 'VP Operations',
        'Vice President of Operations'
      ]]
    }
  },
  {
    title: {
      de: 'Financial Manager',
      en: 'Financial Manager'
    },
    values: {
      de: [[
        'Financial Manager', 'Chief Financial Officer', 'CFO', 'Finance Director', 'Director of Finance',
        'Finanzvorstand', 'Geschäftsführer Finanzen', 'Abteilungsleiter Finanzen', 'Leiter Finanzabteilung',
        'Head of Accounting', 'Leiter Rechnungswesen', 'Leiter Controlling', 'Leiter Buchhaltung'
      ]],
      en: [[
        'Financial Manager', 'Chief Financial Officer', 'CFO', 'Finance Director', 'Director of Finance',
        'VP Finance', 'VP of Finance', 'Finance Manager', 'VP Finance'
      ]]
    }
  },
  {
    title: {
      de: 'IT Manager',
      en: 'IT Manager'
    },
    values: {
      de: [[
        'IT Manager', 'CIO Director of IT', 'Chief Information Officer', 'Director of Information Technology',
        'Vicepresident of IT', 'IT Director', 'Head of IT', 'IT Teamleiter', 'Teamlead IT', 'Teamleiter IT'
      ]],
      en: [[
        'IT Manager', 'CIO', 'Director of IT', 'Chief Information Officer',
        'Director of Information Technology', 'Vice President of IT', 'IT Director'
      ]]
    }
  },
  {
    title: {
      de: 'Chief Technology Manager',
      en: 'Chief Technology Manager'
    },
    values: {
      de: [[
        'Chief Technology Manager', 'CTO Director of Technology', 'VP Technology',
        'Vice President of Technology', 'Technology Director', 'Head of Development',
        'Softwareentwickler', 'Leiter Softwareentwicklung', 'Leiter Webdevelopment',
        'Head of Webdevelopment', 'Head of mobile development', 'Lead Developer',
        'Lead Programmer'
      ]],
      en: [[
        'Chief Technology Officer', 'CTO', 'Director of Technology', 'VP Technology',
        'Vice President of Technology', 'Technology Director'
      ]]
    }
  },
  {
    title: {
      de: 'Customer Service Manager',
      en: 'Customer Service Manager'
    },
    values: {
      en: [[
        'Customer Service Manager', 'Customer Support Manager', 'Customer Success Manager', 'Office Manager',
        'Head of Customer Support', 'Customer Service Director'
      ]]
    }
  },
  {
    title: {
      de: 'Sales Representative',
      en: 'Sales Representative'
    },
    values: {
      de: [[
        'Sales Representative', 'Sales Rep', 'Account Manager', 'Account Executive', 'Business Development',
        'Sales Development', 'Sales Executive', 'SDR', 'BDR'
      ]],
      en: [[
        'Sales Representative', 'Sales Rep', 'Account Manager', 'Account Executive', 'Business Development',
        'Sales Development', 'Sales Executive', 'SDR', 'BDR'
      ]]
    }
  },
  {
    title: {
      de: 'HR Manager',
      en: 'HR Manager'
    },
    values: {
      de: [
        ['Manager', 'Officer', 'Coordinator', 'Director', 'VP', 'President', 'Head of', 'Leiter',
         'Vorstand', 'Advisor', 'Specialist'],
        ['HR', 'Human Resources', 'People', 'Talent', 'Recruiting', 'Personal']
      ],
      en: [
        ['Manager', 'Officer', 'Coordinator', 'Director', 'VP', 'President'],
        ['HR', 'Human Resources', 'People Officer', 'Talent']
      ],
    }
  },
  {
    title: {
      de: 'Product/Project Manager',
      en: 'Product/Project Manager'
    },
    values: {
      de: [[
        'Product Manager', 'Project Manager', 'VP Product', 'Vice President of Product', 'Projektleiter',
        'Produktmanager', 'Projekt Manager', 'Scrum Master', 'Produkt Manager', 'Agile Coach',
        'Projektmanager', 'Produktmanager'
      ]],
      en: [['Product Manager', 'Project Manager', 'VP Product', 'Project Lead']],
    }
  },
  {
    title: {
      de: 'Anwalt',
      en: 'Lawyer'
    },
    values: {
      de: [[
        'Lawyer', 'Attorney', 'Attorney at Law', 'Anwalt', 'Fachanwalt', 'Rechtsanwalt', 'Volljurist',
        'Syndikusrechtsanwalt', 'Unternehmensjurist', 'Legal Counsel'
      ]],
      en: [['Lawyer', 'Attorney', 'Attorney at Law']],
    }
  },
  {
    title: {
      de: 'Realtor',
      en: 'Realtor'
    },
    values: {
      de: [['Real', 'Real Estate', 'Agent', 'Immobilienmakler', 'Immobilienentwickler', 'Immobilienberater']],
      en: [['Realtor', 'Real Estate Agent']]
    }
  },
  {
    title: {
      de: 'Einkauf',
      en: 'Purchasing'
    },
    values: {
      de: [[
        'Einkaufsleiter', 'Strategischer Einkaufsleiter', 'Head of Purchasing', 'Head of Procurement',
        'Purchasing Manager', 'Warengruppeneinkäufer', 'Einkäufer', 'Lead Buyer'
      ]],
      en: [[
        'Head of Purchasing', 'Head of Procurement', 'Purchasing Manager', 'Lead Buyer'
      ]]
    }
  }
];

export { roles };
