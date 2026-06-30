import { withLatency } from '../../../utils/mockMode'

const STORAGE_KEY = 'pt_mock_content'

// Seeded with actual content extracted from the live JS bundle (index-BfzJgbwd.js)
const SEED_CONTENT = {
  hero: {
    headline: 'Premium residential investment designed for long-term passive rental income.',
    subheadline: 'Your pathway to financial freedom.',
    cta_primary: 'View Investment Options',
    cta_secondary: 'Express Interest',
    badge: 'Booking period now open for early investors',
  },
  about: {
    tagline: 'Panda Towers 001 is a residential development project made up of affordable, modern studios and 1-bedrooms along Waiyaki Way for sale. Designed to generate attractive returns for investors who want to add rental income into their investment portfolio.',
    developer_description: 'Panda Towers 001 Developers — a consortium of Kenyan real estate veterans with over 30 years of delivering quality residential, commercial, and single-family developments.',
    mission: 'Building lasting relationships through reliability and integrity.',
    vision: 'This will be the first of many projects by a consortium of seasoned developers with 30 years of experience in building quality and high-yielding multi-unit affordable residential, single-family residential and commercial property in Kenya.',
  },
  investment_calculator: {
    studio_price: 2900000,
    studio_monthly_rent: 16500,
    studio_yield_range: '9 - 10%',
    onebr_price: 3950000,
    onebr_monthly_rent: 28000,
    onebr_yield_range: '7.9 - 9%',
    gross_yield_headline: 9,
    total_units: 140,
    studio_count: 100,
    onebr_count: 40,
  },
  payment_plans: {
    all_cash_studio: 2350000,
    early_bird_studio: 2900000,
    phase1_studio: 3300000,
    all_cash_onebr: 3500000,
    early_bird_onebr: 3950000,
    phase1_onebr: 3700000,
    reservation_fee_studio: 150000,
    reservation_fee_onebr: 200000,
    deposit_percent: 30,
    instalment_months: 24,
  },
  project_specs: {
    floors: 'Ground plus ten storeys with basement parking',
    construction_period: 'A maximum of 24 months, groundbreaking in February 2026 and handover in August 2028.',
    location: 'Waiyaki Way, Nairobi',
    expected_completion: 'August 2028',
    groundbreaking: 'February 2026',
  },
  faq: [
    {
      id: 1,
      question: 'What is Panda Towers 001?',
      answer: 'A high-demand, off-plan opportunity engineered for strong rental yields and significant capital appreciation in a strategic, high-growth area.',
    },
    {
      id: 2,
      question: 'How many units is it?',
      answer: 'Panda Towers 001 consists of 100 studio apartments and 40 1 bedroom apartments.',
    },
    {
      id: 3,
      question: 'How many floors will the project have?',
      answer: 'The project is a ground plus ten storey building with a basement parking & the ground floor having some parking.',
    },
    {
      id: 4,
      question: 'How long is the construction period projected to take?',
      answer: 'A maximum of 24 months, groundbreaking in February 2026 and handover in August 2028.',
    },
    {
      id: 5,
      question: 'How much does one need to reserve a unit?',
      answer: 'KES 150,000 for a studio unit and KES 200,000 for a one bedroom. This amount will go into your 30% deposit upon project groundbreaking in Feb 2026.',
    },
    {
      id: 6,
      question: 'Do the prices include the legal and other county fees?',
      answer: 'The legal fees & other closing costs are not included in the prices. The legal fees are payable to the project lawyers for drafting the agreements, certifying the executed agreements and taking the agreements for stamp duty assessment. Additionally stamp duty is payable directly to KRA, equivalent to 4% of the unit value. All fees should be paid by the investor before project completion.',
    },
    {
      id: 7,
      question: 'Can I invest if I don\'t live in Kenya?',
      answer: 'Yes, we welcome investors from the diaspora.',
    },
    {
      id: 8,
      question: 'Can an investor use their lawyers for conveyance?',
      answer: 'Yes, investors can use their private lawyers for the legal aspects of the project at their (additional) own costs.',
    },
    {
      id: 9,
      question: 'Can you manage the property for investors?',
      answer: 'Yes, we can arrange property management for investors.',
    },
    {
      id: 10,
      question: 'How long is the repayment period for the Instalment option?',
      answer: 'The construction is projected to take 18-24 months.',
    },
    {
      id: 11,
      question: 'Are the units ready for occupation?',
      answer: 'No, Panda Towers 001 is currently under construction with handover expected in August 2028.',
    },
  ],
  track_record: [
    {
      id: 1,
      name: 'Multi-Use, Skuta',
      type: 'Multi-Use',
      location: 'Nyeri',
      units: '112 units: commercial, residential and hospitality',
      status: 'Completed',
    },
    {
      id: 2,
      name: 'Residential, Pipeline',
      type: 'Residential',
      location: 'Embakasi',
      units: '200+ affordable housing units',
      status: 'Completed',
    },
    {
      id: 3,
      name: 'Single Family Homes',
      type: 'Single Family',
      location: 'Kitengela',
      units: '',
      status: 'Completed',
    },
    {
      id: 4,
      name: 'Warehouse',
      type: 'Warehouse',
      location: 'Kikuyu, Kiambu',
      units: '10,000 sqft warehouse space',
      status: 'Completed',
    },
  ],
  seo: {
    home:       { meta_title: 'Panda Towers 001 | Premium Residential Investment', meta_description: 'Build long-term passive rental income confidently with Panda Towers 001. Premium residential development designed for value-driven investors.', meta_keywords: 'real estate investment Kenya, passive rental income, property investment', og_image_url: '' },
    about:      { meta_title: 'About — Panda Towers 001', meta_description: 'Panda Towers 001 is the flagship project of Panda Towers 001 Developers — a consortium of Kenyan real estate veterans with over 30 years of delivering quality developments.', meta_keywords: 'about panda towers, developer, Kenya real estate', og_image_url: '' },
    investment: { meta_title: 'Investment — Panda Towers 001', meta_description: 'A high-demand, off-plan opportunity engineered for strong rental yields and significant capital appreciation.', meta_keywords: 'off plan investment, rental yield Kenya, investment units', og_image_url: '' },
    faq:        { meta_title: 'FAQ — Panda Towers 001', meta_description: 'Everything you need to know about investing in Panda Towers 001.', meta_keywords: 'panda towers FAQ, investment questions, how to invest', og_image_url: '' },
    blog:       { meta_title: 'Blog — Panda Towers 001', meta_description: 'Expert insights, market analysis, and investment strategies to help you make informed decisions.', meta_keywords: 'real estate blog Kenya, investment insights, market analysis', og_image_url: '' },
    contact:    { meta_title: 'Contact — Panda Towers 001', meta_description: 'Get in touch with the Panda Towers 001 team. Our team is here to help with all your investment questions.', meta_keywords: 'contact panda towers, invest pandatowers.africa, site visit', og_image_url: '' },
  },
}

function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // fall through to reseed
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_CONTENT))
  return SEED_CONTENT
}

function saveStore(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export async function mockGetContent() {
  return withLatency(loadStore())
}

export async function mockUpdateSection(section, payload) {
  const data = loadStore()
  data[section] = typeof payload === 'object' && !Array.isArray(payload)
    ? { ...data[section], ...payload }
    : payload
  saveStore(data)
  return withLatency(data[section])
}
