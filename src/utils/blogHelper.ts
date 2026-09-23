import { ImpactNewsItem, Language, BlogArticle, BlogArticleSection, PublicFAQ, JargonExplainer } from '../types';
import { getLocalizedNews } from './localization';

// Custom curated blog dossiers for flagship stories to ensure exceptional depth
const CURATED_BLOGS_EN: Record<string, Partial<BlogArticle>> = {
  'yudh-abhyas': {
    readingTimeMinutes: 4,
    deskName: 'National Strategic & Defense Affairs Desk • New Delhi',
    editorialSubtitle: 'Why the US Army\'s First Deployment of M-LIDS to India Redefines Northern Border Air Defense Against Drone Swarms',
    quickTakeaways: [
      'First-Ever Deployment: US Army brings its battle-tested M-LIDS (Mobile Low, Slow, Small-UAS Integrated Defense System) to India for live combat trials.',
      'High-Altitude Himalayan Interception: Live drills focus on neutralizing hostile drone swarms and loitering munitions along forward high-altitude sectors.',
      'Hybrid Kinetic & Jamming Defense: System pairs 30mm auto-cannons and Coyote interceptor drones with high-power RF electronic warfare jammers.',
      'Make-in-India Integration: Lays the foundation for co-producing vehicle-mounted counter-drone interceptors with Bharat Electronics Limited (BEL).',
    ],
    sections: [
      {
        id: 'event-breakdown',
        heading: '1. What Happened: US Army Deploys Combat-Tested M-LIDS to India',
        subheading: 'Live Interception Trials Under Exercise Yudh Abhyas 2026',
        tag: 'Operational Drill',
        highlightStat: {
          label: 'Defense Engagement',
          value: 'M-LIDS Interceptor Grid',
          sublabel: 'Combat-tested anti-swarm capability',
        },
        summaryBulletPoints: [
          'US Army and Indian Army Air Defense units conducted joint live-fire counter-unmanned aerial system (C-UAS) drills.',
          'M-LIDS units mounted on specialized armored combat vehicles detected, tracked, and eliminated simulated multi-directional drone swarms.',
          'Drills verified data-link sharing between Indian radar networks and American sensor-to-shooter algorithms.',
        ],
        detailedNarrative:
          'During the 2026 edition of Exercise Yudh Abhyas, the United States Army fielded its frontline M-LIDS (Mobile, Low, Slow, Unmanned Aerial Vehicle Integrated Defense System) on Indian soil for the first time. The exercise simulated high-altitude combat environments reminiscent of Eastern Ladakh and the Line of Actual Control (LAC). Both forces conducted simultaneous live-fire engagements against coordinated drone swarms attempting saturation attacks on command hubs. The trials proved that tactical vehicles equipped with modular radar, optical sensors, and precision interceptors can detect and destroy hostile quadcopters and kamikaze loitering munitions within seconds of radar lock.',
      },
      {
        id: 'why-it-matters',
        heading: '2. The Catalyst: Why Modern Warfare Demands Mobile Counter-Drone Shields',
        subheading: 'Lessons from Global Conflicts and Forward Border Vulnerabilities',
        tag: 'Strategic Driver',
        summaryBulletPoints: [
          'Modern warfare has democratized aerial assault; cheap commercial drones with explosive payloads threaten multi-million dollar tanks and radar posts.',
          'The Line of Actual Control (LAC) and Western border face regular loitering munition surveillance and cross-border drug/weapons drops.',
          'Fixed air defense systems are too immobile for fast-maneuvering mountain infantry columns, creating an urgent need for mobile vehicle-mounted shields.',
        ],
        detailedNarrative:
          'Over the past three years, conflicts across Eastern Europe and the Middle East have demonstrated that conventional air defense batteries (like S-400 or Patriot) are prohibitively expensive and sub-optimal for swatting down $1,000 kamikaze drones. Troops along India\'s mountainous frontiers require self-propelled, agile defense platforms that travel directly alongside armored convoys and mechanized infantries. The deployment of M-LIDS in India directly addresses this operational vulnerability by testing vehicle-mounted kinetic cannons and electronic disruptors in rugged, high-altitude terrains.',
      },
      {
        id: 'tech-specs',
        heading: '3. Technical Anatomy: How M-LIDS Destroys Drone Swarms',
        subheading: 'Dual Soft-Kill Electronic Jamming and Hard-Kill Kinetic Interception',
        tag: 'Military Technology',
        highlightStat: {
          label: 'Interception Layer',
          value: 'Kinetic + Electronic',
          sublabel: '30mm XM914 + Coyote interceptor drones',
        },
        summaryBulletPoints: [
          'Ku-band 360° AESA Radar: Detects micro-drones up to 10 km away even amidst mountain clutter.',
          'Soft-Kill Jamming: High-power directional radio-frequency (RF) antennas sever operator control links and spoof GPS coordinates.',
          'Hard-Kill Cannon & Missiles: XM914 30mm autocannon firing proximity-fuzed airburst rounds, complemented by tube-launched Coyote kinetic interceptors.',
        ],
        detailedNarrative:
          'The M-LIDS architecture operates on a complementary two-tier defense philosophy. First, its Ku-band active electronically scanned array (AESA) radar identifies low radar-cross-section flying objects. If the incoming target is a reconnaissance drone, high-gain directional jammers break its telemetry, forcing it to crash or land. If a swarm of explosive suicide drones attacks, the turret-mounted 30mm chain gun releases programmable airburst ammunition that creates a lethal wall of shrapnel in mid-air. For long-distance loitering munitions, Raytheon Coyote interceptor drones are launched directly from vehicle canisters to collide with targets mid-flight.',
      },
      {
        id: 'economic-industrial',
        heading: '4. Industrial & Make-in-India Impact: Joint Co-Production Horizon',
        subheading: 'Transitioning from Field Exercises to Domestic Assembly by BEL',
        tag: 'Economy & Industry',
        highlightStat: {
          label: 'Projected Industrial Outlay',
          value: '₹8,500 Crore',
          sublabel: 'Estimated domestic procurement savings vs direct import',
        },
        summaryBulletPoints: [
          'Under the US-India INDUS-X defense acceleration initiative, discussions are underway to co-produce counter-drone components locally.',
          'Bharat Electronics Limited (BEL) and Indian defense private startups are targeted as Tier-1 integration partners.',
          'Indigenous integration allows Indian Army to mount counter-drone turrets on Indian-made Tata WhAP and Mahindra armored vehicles.',
        ],
        detailedNarrative:
          'This exercise is far more than a bilateral military drill—it serves as the proving ground for joint manufacturing. Under the framework of the Initiative on Critical and Emerging Technologies (iCET) and INDUS-X, Indian defense leadership has made it clear that frontline air defense hardware must be produced domestically. By testing M-LIDS alongside indigenous platforms like the DRDO D-4 drone system and BEL radars, the defense establishment is evaluating transfer-of-technology (ToT) opportunities that could channel thousands of crores into domestic defense manufacturing and create high-tech aerospace engineering jobs across India.',
      },
      {
        id: 'public-citizen-impact',
        heading: '5. Impact on the Common Citizen: Border Security & National Resilience',
        subheading: 'How Tactical Air Defense Directly Shields Civilian Life and Infrastructure',
        tag: 'Citizen Impact',
        summaryBulletPoints: [
          'Prevents cross-border smuggling of illegal firearms and narcotics that infiltrate border villages in Punjab and Jammu & Kashmir.',
          'Safeguards national oil refineries, nuclear power plants, and civilian airports from hostile asymmetrical drone sabotage.',
          'Guarantees soldiers stationed in remote forward outposts are protected by automated defensive bubbles.',
        ],
        detailedNarrative:
          'To the average Indian citizen, drone threats may seem like distant battlefield concepts, but their impact on internal security is immediate. For years, hostile syndicates across western borders have utilized low-cost commercial drones to drop drugs, pistols, and IEDs into border districts. Furthermore, vital economic assets such as the Jamnagar refinery complex, railway bridges, and power grids require anti-drone shields. Enhancing the armed forces\' capability to instantly neutralize drone threats ensures both frontier sovereignty and the safety of critical civilian supply lines.',
      },
      {
        id: 'future-roadmap',
        heading: '6. The Road Ahead: What Steps India Must Take Next',
        subheading: 'Doctrinal Evolution and Accelerated Induction Timelines',
        tag: 'Strategic Roadmap',
        summaryBulletPoints: [
          'Fast-track Army capital procurement for 150+ vehicle-mounted mobile C-UAS systems.',
          'Integrate Army, Navy, and Air Force anti-drone feeds into a unified National Air Defense Command (NADC).',
          'Deploy permanent mobile counter-drone units along critical LAC friction points in Eastern Ladakh and Sikkim.',
        ],
        detailedNarrative:
          'Following the conclusion of Yudh Abhyas 2026, the Indian defense establishment must rapidly translate tactical insights into formal procurement contracts. The immediate priority is integrating the Army\'s indigenous Bhishma radar networks with vehicle-mounted interceptors. Simultaneously, India must finalize licensed co-production agreements to prevent supply crunches during active border standoffs. The objective is clear: establish an impenetrable, sovereign counter-drone shield across every inch of the northern and western borders.',
      },
    ],
    publicFaqs: [
      {
        question: 'What is M-LIDS in simple terms?',
        answer: 'M-LIDS stands for Mobile Low, Slow, Small-UAS Integrated Defense System. Think of it as a specialized armored vehicle equipped with advanced radar, electronic jammers, and an automated rapid-fire cannon designed specifically to hunt and destroy attack drones.',
      },
      {
        question: 'Why did the US Army bring it to India?',
        answer: 'Both India and the United States face severe threats from cheap combat drones. Under Exercise Yudh Abhyas, both armies test each other\'s equipment in harsh mountain environments to ensure they can operate together seamlessly if a regional crisis arises.',
      },
      {
        question: 'Will India buy this system or make its own?',
        answer: 'India follows the \'Make in India\' policy. Rather than buying off-the-shelf, India intends to co-produce similar mobile systems domestically with partners like Bharat Electronics Limited (BEL), incorporating American sensor and interceptor technology into Indian armored vehicles.',
      },
      {
        question: 'Does this mean our borders are safer from drone attacks?',
        answer: 'Yes. Testing and deploying these mobile systems allows the Indian Army to protect border checkposts, moving army convoys, and civilian areas from surprise drone swarms that traditional missile systems cannot easily stop.',
      },
    ],
    jargonList: [
      { term: 'C-UAS', meaning: 'Counter-Unmanned Aerial Systems (anti-drone defense weapons and jammers).' },
      { term: 'Loitering Munitions', meaning: 'Drones that hover above a battlefield searching for targets and crash into them with built-in explosives (kamikaze drones).' },
      { term: 'AESA Radar', meaning: 'Active Electronically Scanned Array radar; an advanced radar that can track dozens of tiny targets in different directions simultaneously without moving parts.' },
      { term: 'Soft-Kill vs Hard-Kill', meaning: 'Soft-kill means disabling a drone electronically with frequency jammers. Hard-kill means shooting it down physically with bullets, lasers, or missiles.' },
    ],
    editorialVerdict:
      'Exercise Yudh Abhyas 2026 confirms that drone warfare is no longer an auxiliary concern but the primary tactical threat of 21st-century battlefields. By mastering mobile counter-drone interception alongside global allies, India is securing both its Himalayan frontiers and the industrial independence of its domestic defense sector.',
  },

  'defence-makeinindia': {
    readingTimeMinutes: 5,
    deskName: 'Defense Production & Economic Security Bureau • New Delhi',
    editorialSubtitle: 'Inside the Historic ₹97,000 Crore ($11.6B) Procurement Clearance: How 98% Domestic Sourcing Empowers Indian Armed Forces and Industry',
    quickTakeaways: [
      'Record $11.6 Billion Clearance: Defence Acquisition Council (DAC) grants Acceptance of Necessity (AoN) for military hardware worth ₹97,000 Crore.',
      '98% Make-in-India Mandate: Nearly the entire allocation is legally ring-fenced for domestic manufacturers under the \'Buy (Indian-IDDM)\' category.',
      'Tri-Service Modernization: Procurement covers Advanced Light Helicopters (ALH) for the Army, naval high-power surveillance radars, and Air Force EW suites.',
      'Massive MSME Ecosystem Boost: Channels direct purchase orders to over 1,200 Indian micro and medium defense engineering vendors.',
    ],
    sections: [
      {
        id: 'procurement-scale',
        heading: '1. The Big Picture: ₹97,000 Crore Approved with 98% Domestic Mandate',
        subheading: 'A Decisive Shift from Foreign Arms Imports to Sovereign Self-Reliance',
        tag: 'Cabinet Decision',
        highlightStat: {
          label: 'Total Capital Outlay',
          value: '₹97,000 Cr ($11.6B)',
          sublabel: '98% mandated for Indian domestic industry',
        },
        summaryBulletPoints: [
          'Defence Acquisition Council, chaired by Raksha Mantri Rajnath Singh, accorded Acceptance of Necessity (AoN) for 10 major capital acquisition proposals.',
          'Approximately 98% of the total approved value is earmarked for acquisition from indigenous sources under Buy (Indian-IDDM).',
          'Covers state-of-the-art combat helicopters, high-altitude surveillance radar grids, and digital electronic warfare platforms.',
        ],
        detailedNarrative:
          'In one of the most substantial indigenization decisions in independent India\'s history, the Defence Acquisition Council (DAC) approved military procurements totaling $11.6 Billion (approx. ₹97,000 Crore). Critically, 98% of this gargantuan sum is strictly mandated to be procured from Indian domestic manufacturers under the \'Buy (Indian-Indigenously Designed, Developed and Manufactured)\' route. This move marks the decisive institutionalization of Atmanirbhar Bharat in national defense, ensuring that taxpayer funds directly invigorate Indian factories, laboratories, and engineers rather than foreign arms conglomerates.',
      },
      {
        id: 'platforms-cleared',
        heading: '2. Platforms Cleared: What the Army, Navy, and Air Force Are Receiving',
        subheading: 'High-Altitude Helicopters, Coastal Radar Networks & Airborne EW Systems',
        tag: 'Military Platforms',
        summaryBulletPoints: [
          'Indian Army: Fleet of Advanced Light Helicopters (ALH Mk III & Mk IV Rudra) equipped with anti-tank guided missiles and night-vision avionics.',
          'Indian Navy: Next-generation maritime surveillance radars and naval loitering munitions to monitor Indian Ocean shipping choke points.',
          'Indian Air Force: Indigenous Electronic Warfare (EW) jamming pods and smart anti-airfield ammunition (SAAW).',
        ],
        detailedNarrative:
          'The procurement list directly addresses operational gaps highlighted by frontline commanders. For the Indian Army, new Advanced Light Helicopters (ALH) manufactured by Hindustan Aeronautics Limited (HAL) will ensure rapid troop deployment and casualty evacuation in Siachen, Eastern Ladakh, and the Northeast. The Indian Navy gains long-range surveillance radar arrays developed by Bharat Electronics Limited (BEL) to track foreign naval assets traversing the Malacca and Sunda straits. The Indian Air Force will receive domestic EW suites to blind hostile air defense radars during combat operations.',
      },
      {
        id: 'economic-jobs',
        heading: '3. The Economic Multiplier: ₹95,000 Crore Injected into Indian Industry',
        subheading: 'High-Skilled Manufacturing, Engineering Careers, and 1,200+ MSMEs',
        tag: 'Jobs & Economy',
        highlightStat: {
          label: 'Supply Chain Base',
          value: '1,200+ MSMEs',
          sublabel: 'Direct beneficiaries across aerospace and electronics hubs',
        },
        summaryBulletPoints: [
          'Primary contracts awarded to public sector giants (HAL, BEL, BDL) and private defense leaders (L&T, Tata Advanced Systems, Bharat Forge).',
          'More than 1,200 Tier-2 and Tier-3 MSMEs across Bengaluru, Hyderabad, Pune, Coimbatore, and Kanpur will supply precision components.',
          'Generates thousands of high-paying engineering, metallurgy, and software development jobs for young Indian STEM graduates.',
        ],
        detailedNarrative:
          'Every rupee spent on domestic defense manufacturing yields a 2.5x economic multiplier. When ₹97,000 Crore is committed to Indian firms, it triggers capital investments across foundries, software houses, sensor laboratories, and mechanical tooling workshops. Instead of foreign currency flowing to Europe, Russia, or the US, money circulates within the Indian economy, driving GST revenues, funding indigenous R&D, and building sovereign capabilities that insulate the country from foreign sanctions or weapon embargos.',
      },
      {
        id: 'strategic-autonomy',
        heading: '4. Strategic Sovereignty: Breaking the Foreign Weapon Supply Leash',
        subheading: 'Why Relying on Foreign Arms Suppliers in Wartime Is Fatal',
        tag: 'Strategic Autonomy',
        summaryBulletPoints: [
          'Historical conflicts and the Ukraine war demonstrated that foreign arms suppliers often delay spare parts delivery during active hostilities.',
          'Domestic design ownership guarantees India cannot be blackmailed by foreign sanctions, export bans, or diplomatic vetoes.',
          'Allows the armed forces to customize weapons specifically for extreme 18,000-foot Himalayan cold and humid tropical sea conditions.',
        ],
        detailedNarrative:
          'Strategic autonomy is meaningless if a nation relies on foreign capitals for jet engine spares, radar microchips, or artillery ammunition. In past conflicts, foreign powers have used end-user restrictions and parts delays to pressure Indian decision-makers. By achieving 98% domestic procurement in this landmark clearance, India ensures that its soldiers fight with weapons built and serviced within the motherland. It also allows software upgrades and combat adjustments to be executed in hours rather than waiting months for foreign technicians.',
      },
      {
        id: 'export-trajectory',
        heading: '5. Global Export Ambitions: Becoming a Defense Supplier to the World',
        subheading: 'Targeting ₹50,000 Crore in Annual Defense Exports by 2029',
        tag: 'Global Trade',
        highlightStat: {
          label: 'Export Goal by 2029',
          value: '₹50,000 Cr / Year',
          sublabel: 'Exporting helicopters, radars, and missiles to Global South',
        },
        summaryBulletPoints: [
          'India\'s defense exports have surged from ₹1,521 Crore in 2016-17 to over ₹21,000 Crore in recent fiscal years.',
          'Platforms like ALH Dhruv, BrahMos, Akash air defense, and naval patrol vessels are now actively purchased by nations across Southeast Asia, Africa, and South America.',
          'Mass production of cleared platforms lowers unit costs, making Indian defense hardware unbeatable in global price-to-performance benchmarks.',
        ],
        detailedNarrative:
          'Scaling domestic defense manufacturing is the essential precursor to dominating international arms exports. As Indian factories achieve mass production for the Indian Armed Forces, the cost per unit plummets. This creates an irresistible value proposition for friendly nations across Asia, Africa, and Latin America who want reliable, battle-tested defense hardware without the predatory political strings attached by Western powers or the dubious reliability of Chinese systems.',
      },
      {
        id: 'citizen-reality',
        heading: '6. What This Means for Ordinary Indians: Security, Taxes, and Pride',
        subheading: 'How a Self-Reliant Military Protects Daily Life and Economic Growth',
        tag: 'Public Value',
        summaryBulletPoints: [
          'Ensures national borders are impregnable, providing the uninterrupted peace necessary for India\'s GDP growth toward $7 Trillion.',
          'Taxpayer rupees are reinvested into local communities and industries rather than enriching foreign defense corporations.',
          'Encourages university students and engineers to launch defense and space tech startups across the nation.',
        ],
        detailedNarrative:
          'National security is the unseen foundation of every citizen\'s daily life. Without secure borders and calm sea lanes, foreign investment evaporates, inflation spikes, and economic growth halts. When the Defence Ministry commits $11.6 Billion to domestic companies, it reassures every Indian that their tax contributions are building a self-reliant technological superpower that neither begs for weapons in wartime nor surrenders territorial integrity.',
      },
    ],
    publicFaqs: [
      {
        question: 'What does "Acceptance of Necessity" (AoN) mean?',
        answer: 'AoN is the official legal green light granted by the Defence Acquisition Council. It certifies that the military genuinely needs these weapons and authorizes the armed forces to begin the commercial contracting and procurement process.',
      },
      {
        question: 'What does "Buy (Indian-IDDM)" mean?',
        answer: 'IDDM stands for \'Indigenously Designed, Developed and Manufactured\'. It is the highest category of defense procurement under Indian law, requiring that the equipment be created by Indian companies with at least 50% domestic content.',
      },
      {
        question: 'How does this help private companies and startups?',
        answer: 'While big contracts may go to HAL or BEL, over 60% of the components (sensors, software, wires, metals, microchips) are sub-contracted to private MSMEs and tech startups across India, creating immense business opportunities.',
      },
      {
        question: 'Will this increase taxes for the common man?',
        answer: 'No. This procurement comes from the existing capital modernization budget already allocated to the Ministry of Defence in the Union Budget. In fact, it saves national wealth by preventing the outflow of foreign exchange reserves.',
      },
    ],
    jargonList: [
      { term: 'DAC', meaning: 'Defence Acquisition Council; the highest decision-making body in India\'s Defence Ministry chaired by the Defence Minister.' },
      { term: 'IDDM', meaning: 'Indigenously Designed, Developed and Manufactured; ensures intellectual property and manufacturing remain inside India.' },
      { term: 'ALH', meaning: 'Advanced Light Helicopter; multi-role twin-engine helicopters built by HAL for high-altitude transport, rescue, and combat.' },
      { term: 'Electronic Warfare (EW)', meaning: 'Military equipment designed to control the electromagnetic spectrum—jamming enemy radars, listening to enemy signals, and protecting friendly radios.' },
    ],
    editorialVerdict:
      'The DAC\'s $11.6 Billion approval is a historic turning point. By requiring 98% domestic procurement, India has transformed defense spending from a foreign fiscal drain into the ultimate domestic industrial engine.',
  },

  'brics-summit': {
    readingTimeMinutes: 5,
    deskName: 'International Diplomacy & Macroeconomics Desk • New Delhi',
    editorialSubtitle: 'Inside the 18th BRICS Summit: Modi-Xi Border Truce, Local-Currency Settlement Rails, and India\'s Trade Deficit Offensive',
    quickTakeaways: [
      'Border De-escalation Priority: PM Modi and President Xi emphasize that peace and tranquility along the LAC is essential for normal bilateral ties.',
      'Confronting $112B Deficit: India directly challenges China on non-tariff barriers, demanding reciprocal market access for Indian pharma and IT services.',
      'Local-Currency Digital Settlement: BRICS declaration advances direct currency clearing rails to protect developing nations from US dollar volatility.',
      'Strategic Autonomy in Action: India proves its unique capacity to anchor the Global South while maintaining strong partnerships with Western democracies.',
    ],
    sections: [
      {
        id: 'summit-event',
        heading: '1. What Happened: New Delhi BRICS Summit Culminates in Strategic Accords',
        subheading: 'High-Level Bilateral Between Modi and Xi & Landmark New Delhi Declaration',
        tag: 'Diplomatic Summit',
        highlightStat: {
          label: 'Bilateral Trade Deficit',
          value: '$112.16 Billion',
          sublabel: 'India-China trade imbalance raised directly by New Delhi',
        },
        summaryBulletPoints: [
          '18th BRICS Leaders Summit concluded with unanimous adoption of the New Delhi Declaration.',
          'Prime Minister Modi met Chinese President Xi Jinping on the summit sidelines, reviewing border disengagement protocols.',
          'BRICS finance ministers operationalized pilot frameworks for inter-bank messaging and local-currency energy trade settlements.',
        ],
        detailedNarrative:
          'The 18th BRICS Leaders Summit in New Delhi delivered both monumental multilateral agreements and intense bilateral breakthroughs. In the official New Delhi Declaration, member states committed to reforming international financial institutions and rolling out cross-border digital payment gateways. On the bilateral front, Prime Minister Narendra Modi held focused discussions with Chinese President Xi Jinping, emphasizing that "differences must not become disputes" and asserting that verified peace along the Line of Actual Control (LAC) remains the non-negotiable prerequisite for economic cooperation.',
      },
      {
        id: 'trade-deficit-reality',
        heading: '2. The Economic Crucible: Tackling the $112 Billion Trade Deficit',
        subheading: 'Why India Can No Longer Tolerate One-Sided Trade with Beijing',
        tag: 'Economy & Trade',
        summaryBulletPoints: [
          'India imported over $118 Billion in goods from China while exporting barely $16 Billion, causing an unsustainable trade gap.',
          'India formally demanded the removal of opaque regulatory restrictions blocking Indian generic pharmaceuticals, IT services, and agricultural produce from Chinese markets.',
          'New Delhi emphasized that future trade cooperation depends on genuine reciprocity and industrial supply chain diversification.',
        ],
        detailedNarrative:
          'While diplomatic communiqués frequently highlight friendship, the core economic reality between India and China is an alarming trade imbalance exceeding $112 Billion annually. India purchases massive volumes of active pharmaceutical ingredients (APIs), solar cells, electronics, and industrial machinery from China, while Beijing imposes bureaucratic non-tariff hurdles on world-class Indian medicines, software, and agricultural produce. At the New Delhi summit, Indian leadership took an unapologetic stance: normal trade relations cannot continue if China treats India solely as a consumption market while blocking Indian exports.',
      },
      {
        id: 'currency-revolution',
        heading: '3. De-Dollarization Reality: What the BRICS Payment Gateway Means',
        subheading: 'Bypassing SWIFT and Sanctions for Essential Energy and Food Imports',
        tag: 'Financial Sovereignty',
        highlightStat: {
          label: 'Annual Forex Savings',
          value: '₹32,000 Crore',
          sublabel: 'Projected savings on dollar conversion and transaction fees',
        },
        summaryBulletPoints: [
          'BRICS economies account for over 45% of the world population and a larger share of global purchasing-power GDP than the G7.',
          'New payment rails enable direct Rupee-Ruble, Rupee-Dirham, and local-currency settlement for crude oil, fertilizer, and machinery.',
          'Protects developing nations from secondary sanctions imposed through the Western-dominated SWIFT banking network.',
        ],
        detailedNarrative:
          'The weaponization of the US dollar and SWIFT banking network following the 2022 Ukraine conflict sent shockwaves through emerging economies. At the New Delhi summit, BRICS leaders advanced alternative financial clearing rails that allow direct central bank-to-central bank settlements using domestic currencies. For India, settling crude oil and fertilizer purchases in Rupees or partner currencies eliminates expensive conversion fees, saves approximately ₹32,000 Crore annually, and insulates national energy security from unilateral Western sanctions.',
      },
      {
        id: 'border-security',
        heading: '4. The Security Front: LAC Tranquility and Buffer Zone Management',
        subheading: 'Moving Beyond Galwan: Verification, Patrol Rights, and Troop Pullbacks',
        tag: 'National Security',
        summaryBulletPoints: [
          'Modi-Xi discussions built upon the mutual disengagement pacts achieved in Depsang and Demchok.',
          'Both sides instructed their Special Representatives to institutionalize regular border management hotlines.',
          'India made it unequivocally clear that military de-escalation must be verified on the ground before normal economic exchanges resume.',
        ],
        detailedNarrative:
          'The shadow of the 2020 Galwan clash and subsequent multi-year military standoffs in Eastern Ladakh has fundamentally altered Sino-Indian relations. While diplomatic dialogues in New Delhi were cordial, Indian military posture remains on high alert. India\'s strategic objective is not cosmetic photo-ops, but verified, irreversible pullback of Chinese heavy artillery and troop concentrations from the LAC, along with the restoration of historic patrolling rights for Indian jawans in contested sectors.',
      },
      {
        id: 'public-citizen-impact',
        heading: '5. Impact on Everyday Indians: Prices, Medicines, and Border Peace',
        subheading: 'How International Diplomacy Translates into Domestic Kitchen Tables',
        tag: 'Public Value',
        summaryBulletPoints: [
          'Stable local-currency energy trade shields Indian consumers from sudden petrol and diesel price spikes.',
          'Lower fertilizer import costs translate directly into affordable agricultural inputs for Indian farmers.',
          'Border peace ensures billions in defense spending can increasingly support public infrastructure, healthcare, and education.',
        ],
        detailedNarrative:
          'To the everyday citizen, high-stakes international summits might feel distant from daily routines. Yet the outcomes of the New Delhi BRICS summit touch every household. When India secures crude oil and fertilizer through sovereign currency channels, it dampens inflation at the petrol pump and grocery store. When Indian pharmaceutical firms gain wider international market access, domestic healthcare manufacturing expands. And when northern frontiers remain tranquil, national resources can focus on domestic prosperity rather than emergency military mobilizations.',
      },
      {
        id: 'future-moves',
        heading: '6. India\'s Strategic Tightrope: Walking Between the Quad and BRICS',
        subheading: 'How New Delhi Preserves Strategic Autonomy as a Global Super-Connector',
        tag: 'Foreign Policy',
        summaryBulletPoints: [
          'India refuses to be an instrument of anti-Western rhetoric within BRICS while also refusing to be a subordinate junior partner in Western alliances.',
          'New Delhi will maintain strong defense ties with Quad partners (US, Japan, Australia) while deepening economic trade with the Global South.',
          'Fast-tracking RBI\'s Digital Rupee (e₹) interoperability with partner central banks across the Indian Ocean.',
        ],
        detailedNarrative:
          'India\'s foreign policy under Prime Minister Modi has mastered the art of non-aligned strategic autonomy. Unlike China or Russia, India maintains close, vital partnerships with Washington, Paris, Tokyo, and Canberra. By hosting a successful BRICS summit while simultaneously chairing critical Quad security initiatives, India reinforces its status as the indispensable bridge between the developed West and the developing Global South—acting always and exclusively in the national interest of 1.4 billion Indians.',
      },
    ],
    publicFaqs: [
      {
        question: 'Does the BRICS currency agreement mean the US Dollar is going away?',
        answer: 'No. The US Dollar remains the world\'s primary reserve currency. However, BRICS countries are creating backup settlement systems using their own currencies (like the Rupee) so they are not completely dependent on Western banking systems for essential goods like oil and food.',
      },
      {
        question: 'Has the border dispute with China been completely solved?',
        answer: 'Not completely, but substantial progress has been made. Both leaders agreed that peace along the border is necessary and instructed their diplomats to finalize patrol agreements and buffer zones to avoid future clashes.',
      },
      {
        question: 'Why does India buy so much more from China than it sells?',
        answer: 'China is the manufacturing capital of the world for electronics, raw chemicals for medicines (APIs), and solar panels. India is building domestic manufacturing (through PLI schemes) to reduce this reliance, but in the meantime, India is demanding China open its market to Indian IT and medicines.',
      },
      {
        question: 'How does this help an ordinary Indian citizen?',
        answer: 'It keeps fuel prices stable, makes fertilizers cheaper for farmers, protects our borders, and expands international export markets for Indian companies, creating more domestic jobs.',
      },
    ],
    jargonList: [
      { term: 'BRICS', meaning: 'An alliance of major emerging economies originally comprising Brazil, Russia, India, China, and South Africa, now expanded to include the UAE, Iran, Egypt, and Ethiopia.' },
      { term: 'Trade Deficit', meaning: 'When a country buys (imports) more goods from another country than it sells (exports) to it. India imports $112 Billion more from China than it exports.' },
      { term: 'SWIFT', meaning: 'The Society for Worldwide Interbank Financial Telecommunication; the global electronic messaging network that banks use to send money across borders.' },
      { term: 'Strategic Autonomy', meaning: 'India\'s foreign policy principle of making independent decisions based solely on its own national interests, without joining military alliances or taking orders from superpowers.' },
    ],
    editorialVerdict:
      'The New Delhi BRICS Summit showcased India\'s maturity as a confident global power. By demanding border peace from Beijing while championing sovereign currency settlement for the Global South, India demonstrated that economic pragmatism and national defense can advance hand in hand.',
  },
};

// Hindi translations and localizations for the curated blogs
const CURATED_BLOGS_HI: Record<string, Partial<BlogArticle>> = {
  'yudh-abhyas': {
    readingTimeMinutes: 4,
    deskName: 'राष्ट्रीय सामरिक एवं रक्षा ब्यूरो • नई दिल्ली',
    editorialSubtitle: 'युद्धाभ्यास 2026 में M-LIDS काउंटर-ड्रोन सिस्टम की तैनाती: जानिए हिमालयी सीमा पर ड्रोन हमलों के खिलाफ भारत की नई सुरक्षा ढाल',
    quickTakeaways: [
      'पहली बार भारत में तैनाती: अमेरिकी सेना ने अपना युद्ध-परीक्षित M-LIDS मोबाइल काउंटर-ड्रोन सिस्टम पहली बार भारतीय जमीन पर तैनात किया।',
      'हिमालयी सीमा पर लाइव परीक्षण: ऊंचाई वाले क्षेत्रों में दुश्मन के ड्रोन झुंड (Swarm) और आत्मघाती ड्रोन्स को हवा में नष्ट करने का संयुक्त अभ्यास।',
      'इलेक्ट्रॉनिक जैमिंग और 30mm तोप का मेल: रेडियो फ्रीक्वेंसी से ड्रोन्स का सिग्नल काटना और ऑटोमैटिक कैनन से हवा में परखच्चे उड़ाना।',
      'मेक इन इंडिया के तहत निर्माण की तैयारी: भारत इलेक्ट्रॉनिक्स लिमिटेड (BEL) के साथ मिलकर भारत में इस तकनीक के निर्माण का मार्ग प्रशस्त।',
    ],
    sections: [
      {
        id: 'event-breakdown',
        heading: '1. वास्तव में क्या हुआ: युद्धाभ्यास 2026 में M-LIDS का लाइव कॉम्बैट ट्रायल',
        subheading: 'भारत और अमेरिकी सेना का संयुक्त काउंटर-ड्रोन युद्धाभ्यास',
        tag: 'सैन्य अभ्यास',
        highlightStat: {
          label: 'रक्षा क्षमता',
          value: 'M-LIDS एयर डिफेंस',
          sublabel: 'ड्रोन झुंड को नष्ट करने वाली मोबाइल प्रणाली',
        },
        summaryBulletPoints: [
          'भारतीय सेना की एयर डिफेंस यूनिट्स और अमेरिकी सेना ने मिलकर अत्याधुनिक काउंटर-ड्रोन हथियारों का लाइव-फायर अभ्यास किया।',
          'बख्तरबंद वाहनों पर लगे M-LIDS सिस्टम ने कई दिशाओं से आने वाले ड्रोन्स को रडार पर पकड़ा और सेकंडों में मार गिराया।',
          'भारतीय रडार और अमेरिकी हथियारों के बीच डिजिटल डेटा लिंक का सफल समन्वय स्थापित किया गया।',
        ],
        detailedNarrative:
          'भारत-अमेरिका संयुक्त सैन्य अभ्यास "युद्धाभ्यास 2026" के दौरान अमेरिकी सेना ने अपना अत्याधुनिक M-LIDS (मोबाइल लो, स्लो, स्मॉल यूएएस इंटीग्रेटेड डिफेंस सिस्टम) पहली बार भारत लाया। यह अभ्यास पूर्वी लद्दाख और वास्तविक नियंत्रण रेखा (LAC) जैसी अत्यंत कठिन पर्वतीय परिस्थितियों के अनुकूल तैयार किया गया था। दोनों सेनाओं ने एक साथ कई नकली ड्रोन्स के हमलों को हवा में ही नाकाम करने का अभ्यास किया। परीक्षणों ने साबित किया कि यह सिस्टम ऊंचाई वाले इलाकों में चलते-फिरते सैन्य काफिलों को आत्मघाती ड्रोन्स से 100% सुरक्षा दे सकता है।',
      },
      {
        id: 'why-it-matters',
        heading: '2. यह कदम क्यों जरूरी था: आधुनिक युद्ध में ड्रोन्स का बढ़ता खतरा',
        subheading: 'रूस-यूक्रेन युद्ध के सबक और भारतीय सीमाओं पर ड्रोन्स की घुसपैठ',
        tag: 'रणनीतिक आवश्यकता',
        summaryBulletPoints: [
          'आधुनिक युद्ध में सस्ते कामिकेज़ (आत्मघाती) ड्रोन्स करोड़ों रुपये के टैंकों और रडार पोस्ट को तबाह कर रहे हैं।',
          'पश्चिमी सीमा पर पाकिस्तान की ओर से हथियारों और ड्रग्स की ड्रोन तस्करी और उत्तरी सीमा पर चीनी ड्रोन्स की निगरानी लगातार जारी है।',
          'पारंपरिक भारी मिसाइल सिस्टम (जैसे S-400) छोटे ड्रोन्स को मारने के लिए बहुत महंगे हैं; इसलिए मोबाइल व त्वरित सुरक्षा ढाल जरूरी है।',
        ],
        detailedNarrative:
          'हालिया वैश्विक संघर्षों ने स्पष्ट कर दिया है कि आधुनिक युद्ध में सबसे बड़ा खतरा लाखों रुपये की मिसाइलें नहीं, बल्कि कुछ हजार रुपयों में बनने वाले विस्फोटक ड्रोन्स हैं। भारत की सीमाओं पर दुर्गम पहाड़ियों में जब सेना के काफिले आगे बढ़ते हैं, तो उन्हें ऐसी सुरक्षा चाहिए जो उनके साथ चल सके। M-LIDS जैसी तकनीक बख्तरबंद गाड़ियों पर फिट होकर चलती है और सैनिकों को एक ऐसा सुरक्षा घेरा देती है जिसे कोई भी ड्रोन पार नहीं कर सकता।',
      },
      {
        id: 'tech-specs',
        heading: '3. तकनीकी क्षमता: M-LIDS ड्रोन्स को कैसे नष्ट करता है?',
        subheading: 'सॉफ्ट-किल (जैमिंग) और हार्ड-किल (तोप व मिसाइल) का अचूक संगम',
        tag: 'सैन्य तकनीक',
        highlightStat: {
          label: 'सुरक्षा स्तर',
          value: 'सॉफ्ट-किल + हार्ड-किल',
          sublabel: '30mm ऑटोमैटिक कैनन + कायोटी मिसाइल',
        },
        summaryBulletPoints: [
          '360-डिग्री AESA रडार: पहाड़ों के बीच भी 10 किलोमीटर दूर से उड़ती हुई छोटी चिड़िया जितने बड़े ड्रोन को पकड़ लेता है।',
          'सॉफ्ट-किल जैमिंग: ड्रोन के रिमोट कंट्रोल और जीपीएस सिग्नल को तुरंत जाम कर देता है, जिससे ड्रोन हवा में ही गिर जाता है।',
          '30mm ऑटोमैटिक कैनन: हवा में छर्रे उड़ाने वाले विशेष गोलों से एक साथ पूरे ड्रोन झुंड के टुकड़े-टुकड़े कर देता है।',
        ],
        detailedNarrative:
          'M-LIDS की ताकत उसके दोहरे वार में है। पहले इसका रडार दुश्मन के ड्रोन को बहुत दूर से ट्रैक कर लेता है। यदि ड्रोन केवल जासूसी कर रहा है, तो सिस्टम शक्तिशाली रेडियो तरंगें छोड़कर उसका रिमोट कनेक्शन काट देता है (सॉफ्ट-किल)। यदि कोई विस्फोटक ड्रोन तेजी से हमला करने आता है, तो इसकी 30mm चेन गन हवा में ही विस्फोट करने वाले गोलों की बौछार कर देती है, जिससे ड्रोन टकराने से पहले ही जलकर राख हो जाता है।',
      },
      {
        id: 'economic-industrial',
        heading: '4. भारत के उद्योग और मेक इन इंडिया पर प्रभाव',
        subheading: 'सीधे आयात के बजाय भारत में संयुक्त विनिर्माण और ₹8,500 करोड़ की बचत',
        tag: 'अर्थव्यवस्था व रोजगार',
        highlightStat: {
          label: 'अनुमानित बचत',
          value: '₹8,500 करोड़',
          sublabel: 'घरेलू निर्माण से विदेशी मुद्रा की भारी बचत',
        },
        summaryBulletPoints: [
          'भारत-अमेरिका इंडस-एक्स (INDUS-X) रक्षा समझौते के तहत इस तकनीक को भारत में बनाने पर बातचीत चल रही है।',
          'भारत इलेक्ट्रॉनिक्स लिमिटेड (BEL) और घरेलू रक्षा स्टार्टअप्स को सब-कंपोनेंट्स बनाने का सीधा काम मिलेगा।',
          'टाटा और महिंद्रा की स्वदेशी बख्तरबंद गाड़ियों पर इस काउंटर-ड्रोन सिस्टम को तैनात किया जा सकेगा।',
        ],
        detailedNarrative:
          'भारत सरकार की नीति बिल्कुल साफ है: हथियार केवल विदेशों से खरीदे नहीं जाएंगे, बल्कि भारत में बनाए जाएंगे। इस अभ्यास के जरिए रक्षा मंत्रालय यह देख रहा है कि इस तकनीक को भारतीय कंपनियों के साथ कैसे जोड़ा जाए। इससे न केवल देश की रक्षा मजबूत होगी, बल्कि हजारों भारतीय इंजीनियरों और युवाओं को रक्षा विनिर्माण में उच्च-वेतन वाली नौकरियां मिलेंगी और देश का पैसा देश में ही रहेगा।',
      },
      {
        id: 'citizen-impact',
        heading: '5. आम जनता और देशवासियों पर सीधा असर',
        subheading: 'सीमावर्ती गांवों की सुरक्षा, आंतरिक शांति और हवाई अड्डों का संरक्षण',
        tag: 'जन सुरक्षा',
        summaryBulletPoints: [
          'पंजाब और जम्मू-कश्मीर के सीमावर्ती गांवों में पाकिस्तान से आने वाली ड्रग्स और बंदूकों की ड्रोन सप्लाई पर पूर्ण विराम।',
          'देश की तेल रिफाइनरियों, न्यूक्लियर प्लांट्स और नागरिक हवाई अड्डों को आतंकी ड्रोन हमलों से सुरक्षा।',
          'सीमा पर तैनात हमारे वीर जवानों की सुरक्षा सुनिश्चित, जिससे देश में व्यापार और विकास बिना डर के चलता रहे।',
        ],
        detailedNarrative:
          'आम नागरिक के लिए सीमा की सुरक्षा ही देश की आर्थिक प्रगति की पहली शर्त है। जब सीमाएं सुरक्षित होती हैं, तभी देश में उद्योग चलते हैं और निवेश आता है। इसके अलावा, पंजाब और जम्मू में ड्रोन के जरिए गिराई जाने वाली नशीली दवाएं हमारे युवाओं को बर्बाद कर रही थीं। ऐसी आधुनिक काउंटर-ड्रोन तकनीक सीमा पर तैनात होने से तस्करों के ड्रोन्स हवा में ही गिराए जा सकेंगे, जिससे हमारे युवाओं और समाज की सीधी रक्षा होगी।',
      },
      {
        id: 'future-moves',
        heading: '6. आगे की राह: भारत का अगला कदम क्या होगा?',
        subheading: 'सेना के भीष्म रडार से जोड़ना और लद्दाख-सिक्किम में स्थायी तैनाती',
        tag: 'भविष्य का रोडमैप',
        summaryBulletPoints: [
          'भारतीय सेना द्वारा 150 से अधिक मोबाइल काउंटर-ड्रोन वाहनों की खरीद प्रक्रिया को तेजी से आगे बढ़ाना।',
          'सेना के स्वदेशी \'भीष्म\' रडार नेटवर्क के साथ जोड़कर एक एकीकृत एयर डिफेंस ग्रिड तैयार करना।',
          'पूर्वी लद्दाख और सिक्किम की फॉरवर्ड चौकियों पर इन सिस्टम्स को स्थायी रूप से तैनात करना।',
        ],
        detailedNarrative:
          'युद्धाभ्यास 2026 के सफल समापन के बाद भारत का ध्यान अब इस अनुभव को त्वरित नीति में बदलने पर है। भारतीय सेना अपनी वायु रक्षा इकाइयों को ऐसे अत्याधुनिक मोबाइल हथियारों से लैस करेगी ताकि अगर कभी सीमा पर कोई तनाव हो, तो भारत की सेना हर चुनौती का मुंहतोड़ जवाब देने के लिए पहले से तैयार रहे।',
      },
    ],
    publicFaqs: [
      {
        question: 'आसान शब्दों में M-LIDS क्या है?',
        answer: 'M-LIDS एक बख्तरबंद गाड़ी पर लगा अत्याधुनिक सिस्टम है, जिसमें शक्तिशाली रडार, इलेक्ट्रॉनिक जैमर और ऑटोमैटिक तोप लगी होती है। इसका एकमात्र काम आसमान में उड़ने वाले दुश्मन के हमलावर ड्रोन्स को ढूंढकर मार गिराना है।',
      },
      {
        question: 'क्या भारत इसे अमेरिका से खरीदेगा या खुद बनाएगा?',
        answer: 'भारत की नीति \'मेक इन इंडिया\' की है। भारत सीधे खरीदने के बजाय अमेरिकी तकनीक के साथ मिलकर भारत इलेक्ट्रॉनिक्स (BEL) और घरेलू कंपनियों के जरिए भारत में ही ऐसे सिस्टम्स का निर्माण करेगा।',
      },
      {
        question: 'इससे आम जनता या युवाओं को क्या फायदा है?',
        answer: 'सीमा पर शांति रहेगी, सीमावर्ती क्षेत्रों में ड्रग्स और हथियारों की ड्रोन तस्करी रुकेगी, और भारत में रक्षा निर्माण बढ़ने से युवाओं को इंजीनियरिंग और हाई-टेक मैन्युफैक्चरिंग में लाखों नौकरियां मिलेंगी।',
      },
      {
        question: 'क्या यह हिमालय की कड़ाके की ठंड में काम कर सकता है?',
        answer: 'जी हां! युद्धाभ्यास 2026 में इस सिस्टम का परीक्षण विशेष रूप से लद्दाख और हिमालय जैसी कड़ाके की ठंड और ऊंचाई वाले क्षेत्रों के लिए ही किया गया है।',
      },
    ],
    jargonList: [
      { term: 'काउंटर-ड्रोन (C-UAS)', meaning: 'ड्रोन-रोधी हथियार; जो दुश्मन के ड्रोन्स को जाम या नष्ट करते हैं।' },
      { term: 'कामिकेज़ ड्रोन', meaning: 'आत्मघाती ड्रोन; जो विस्फोटकों से लदे होते हैं और सीधे लक्ष्य से टकराकर खुद को उड़ा लेते हैं।' },
      { term: 'सॉफ्ट-किल', meaning: 'बिना गोली चलाए रेडियो तरंगों से ड्रोन का सिग्नल काट देना ताकि वह गिर जाए।' },
      { term: 'हार्ड-किल', meaning: 'तोप के गोले या मिसाइल से हवा में ही ड्रोन को उड़ा देना।' },
    ],
    editorialVerdict:
      'युद्धाभ्यास 2026 ने साबित कर दिया है कि 21वीं सदी के युद्ध में ड्रोन ही सबसे बड़ा हथियार और सबसे बड़ा खतरा हैं। भारत ने समय रहते इस खतरे को पहचानकर अपनी सीमाओं को अभेद्य बनाने की दिशा में एक ऐतिहासिक छलांग लगाई है।',
  },

  'defence-makeinindia': {
    readingTimeMinutes: 5,
    deskName: 'रक्षा उत्पादन एवं आर्थिक सुरक्षा ब्यूरो • नई दिल्ली',
    editorialSubtitle: '₹97,000 करोड़ ($11.6B) की ऐतिहासिक रक्षा खरीद: 98% सामान भारतीय कंपनियों से खरीदने के फैसले का पूरा विश्लेषण',
    quickTakeaways: [
      '₹97,000 करोड़ की मेगा मंजूरी: रक्षा अधिग्रहण परिषद (DAC) ने तीनों सेनाओं के लिए हथियारों की खरीद को हरी झंडी दी।',
      '98% मेक इन इंडिया अनिवार्य: कुल बजट का 98% हिस्सा कानूनन केवल भारतीय कंपनियों (Buy Indian-IDDM) से खरीदा जाएगा।',
      'तीनों सेनाओं का आधुनिकीकरण: सेना के लिए नए हेलीकॉप्टर, नौसेना के लिए निगरानी रडार और वायुसेना के लिए इलेक्ट्रॉनिक वॉरफेयर सिस्टम।',
      '1,200 से अधिक एमएसएमई को काम: भारत के छोटे और मध्यम उद्योगों को सीधे हजारों करोड़ रुपये के कलपुर्जों के ऑर्डर मिलेंगे।',
    ],
    sections: [
      {
        id: 'procurement-scale',
        heading: '1. बड़ी खबर: ₹97,000 करोड़ की खरीद और 98% घरेलू निर्माण की शर्त',
        subheading: 'विदेशी हथियारों पर निर्भरता से पूर्ण आत्मनिर्भरता की ओर भारत का सबसे बड़ा कदम',
        tag: 'कैबिनेट फैसला',
        highlightStat: {
          label: 'कुल मंजूर बजट',
          value: '₹97,000 करोड़ ($11.6B)',
          sublabel: '98% खरीद भारतीय कंपनियों से करने का फैसला',
        },
        summaryBulletPoints: [
          'रक्षा मंत्री राजनाथ सिंह की अध्यक्षता में रक्षा अधिग्रहण परिषद ने 10 बड़े रक्षा प्रस्तावों को मंजूरी (AoN) दी।',
          'लगभग पूरा का पूरा बजट घरेलू भारतीय उद्योगों और पीएसयू के लिए आरक्षित किया गया है।',
          'आधुनिक लड़ाकू हेलीकॉप्टर, समुद्री रडार नेटवर्क और इलेक्ट्रॉनिक युद्धक प्रणालियों की खरीद शामिल है।',
        ],
        detailedNarrative:
          'आजाद भारत के इतिहास में रक्षा आत्मनिर्भरता के सबसे बड़े फैसलों में से एक के तहत रक्षा अधिग्रहण परिषद (DAC) ने ₹97,000 करोड़ (लगभग 11.6 बिलियन डॉलर) की रक्षा खरीद को मंजूरी दे दी है। सबसे ऐतिहासिक बात यह है कि इस पूरी राशि का 98% हिस्सा केवल और केवल घरेलू भारतीय कंपनियों से खरीदा जाएगा। इसका सीधा मतलब यह है कि देश की जनता के टैक्स का पैसा विदेशी हथियार कंपनियों की तिजोरी में जाने के बजाय भारत की फैक्ट्रियों, इंजीनियरों और मजदूरों के पास आएगा।',
      },
      {
        id: 'platforms-cleared',
        heading: '2. सेनाओं को क्या मिलेगा: हेलीकॉप्टर, रडार और इलेक्ट्रॉनिक हथियार',
        subheading: 'भारतीय सेना, नौसेना और वायुसेना की जरूरतों के हिसाब से तैयार लिस्ट',
        tag: 'सैन्य साजो-सामान',
        summaryBulletPoints: [
          'भारतीय सेना: हिंदुस्तान एयरोनॉटिक्स (HAL) द्वारा निर्मित एडवांस्ड लाइट हेलीकॉप्टर (ALH रुद्र व ध्रुव) मिलेंगे, जो सियाचिन और लद्दाख में तैनात होंगे।',
          'भारतीय नौसेना: हिंद महासागर में चीनी युद्धपोतों और पनडुब्बियों पर नजर रखने के लिए लंबी दूरी के सर्विलांस रडार मिलेंगे।',
          'भारतीय वायुसेना: दुश्मन के रडार को अंधा करने वाले आधुनिक इलेक्ट्रॉनिक जैमिंग पॉड्स और स्मार्ट बम मिलेंगे।',
        ],
        detailedNarrative:
          'इस खरीद में तीनों सेनाओं की सबसे जरूरी प्राथमिकताओं को शामिल किया गया है। भारतीय सेना को एचएएल द्वारा बनाए जाने वाले अत्याधुनिक लाइट हेलीकॉप्टर दिए जाएंगे, जो रात के अंधेरे में भी पहाड़ों में सटीक मिसाइल हमला कर सकते हैं। नौसेना को भारत इलेक्ट्रॉनिक्स (BEL) के आधुनिक रडार दिए जाएंगे जो मलक्का जलडमरूमध्य से गुजरने वाले हर संदिग्ध जहाज पर 24 घंटे नजर रखेंगे। वहीं वायुसेना को ऐसे हथियार दिए जाएंगे जो युद्ध के समय दुश्मन के संचार तंत्र को पूरी तरह ठप कर सकें।',
      },
      {
        id: 'economic-jobs',
        heading: '3. देश की अर्थव्यवस्था और नौकरियों पर असर: ₹95,000 करोड़ का निवेश',
        subheading: '1,200 एमएसएमई, स्टार्टअप्स और लाखों युवाओं के लिए रोजगार का अवसर',
        tag: 'अर्थव्यवस्था व रोजगार',
        highlightStat: {
          label: 'लाभार्थी उद्योग',
          value: '1,200+ एमएसएमई',
          sublabel: 'बेंगलुरु, पुणे, हैदराबाद और कोयंबटूर के डिफेंस कॉरिडोर्स',
        },
        summaryBulletPoints: [
          'एचएएल, बीईएल, एलएंडटी, टाटा और भारत फोर्ज जैसी कंपनियों को मुख्य अनुबंध मिलेंगे।',
          'इन बड़ी कंपनियों के साथ जुड़े 1,200 से अधिक छोटे कलपुर्जे बनाने वाले एमएसएमई को सीधे काम मिलेगा।',
          'आईटी, सॉफ्टवेयर, मेटलर्जी और इलेक्ट्रॉनिक्स के भारतीय युवाओं को लाखों हाई-पेइंग नौकरियां मिलेंगी।',
        ],
        detailedNarrative:
          'अर्थशास्त्र का नियम है कि रक्षा निर्माण में खर्च किया गया हर रुपया अर्थव्यवस्था में ढाई गुना मूल्य पैदा करता है। जब ₹97,000 करोड़ भारतीय कंपनियों को दिए जाते हैं, तो यह पैसा देश के स्टील प्लांट, कंप्यूटर चिप प्रयोगशालाओं, सॉफ्टवेयर कंपनियों और वेल्डिंग वर्कशॉप्स में घूमता है। इससे देश के रक्षा गलियारों में जबरदस्त औद्योगिक क्रांति आएगी और भारत के युवाओं को अपनी प्रतिभा दिखाने के लिए विदेश जाने की जरूरत नहीं पड़ेगी।',
      },
      {
        id: 'strategic-autonomy',
        heading: '4. सामरिक संप्रभुता: युद्ध के समय विदेशी प्रतिबंधों का डर खत्म',
        subheading: 'कारगिल और यूक्रेन युद्ध का सबक: दूसरों के हथियारों से युद्ध नहीं जीते जाते',
        tag: 'राष्ट्रीय सुरक्षा',
        summaryBulletPoints: [
          'इतिहास गवाह है कि युद्ध के समय विदेशी देश अक्सर कलपुर्जों की सप्लाई रोककर भारत पर दबाव बनाते थे।',
          'जब हथियार भारत में बने होंगे, तो कोई भी विदेशी महाशक्ति भारत को ब्लैकमेल नहीं कर सकेगी।',
          'भारतीय हथियारों को भारतीय सेना की जरूरतों और हिमालय के मौसम के हिसाब से कस्टमाइज किया गया है।',
        ],
        detailedNarrative:
          'अगर हमारे लड़ाकू विमान या रडार के कलपुर्जे विदेशों से आते हैं, तो संकट के समय कोई भी विदेशी ताकत हमें ब्लैकमेल कर सकती है। रूस-यूक्रेन युद्ध ने पूरी दुनिया को सिखा दिया है कि अपनी सुरक्षा के लिए दूसरों पर निर्भर रहना आत्मघाती है। 98% घरेलू खरीद सुनिश्चित करके भारत ने यह सुनिश्चित कर दिया है कि अगर कभी युद्ध होता है, तो हमारी सेना को किसी विदेशी देश के सामने हाथ नहीं फैलाने पड़ेंगे।',
      },
      {
        id: 'export-trajectory',
        heading: '5. भारत बनेगा दुनिया का बड़ा रक्षा निर्यातक',
        subheading: '2029 तक ₹50,000 करोड़ सालाना रक्षा निर्यात का राष्ट्रीय लक्ष्य',
        tag: 'वैश्विक व्यापार',
        highlightStat: {
          label: 'निर्यात लक्ष्य (2029)',
          value: '₹50,000 करोड़/वर्ष',
          sublabel: 'एशिया, अफ्रीका और लैटिन अमेरिका को हथियारों की आपूर्ति',
        },
        summaryBulletPoints: [
          'भारत का रक्षा निर्यात पिछले 7 सालों में ₹1,500 करोड़ से बढ़कर ₹21,000 करोड़ को पार कर चुका है।',
          'फिलीपींस, आर्मेनिया और कई अफ्रीकी देश भारत से ब्रह्मोस मिसाइल, आकाश एयर डिफेंस और हेलीकॉप्टर खरीद रहे हैं।',
          'घरेलू उत्पादन बढ़ने से प्रति यूनिट लागत कम होगी, जिससे भारतीय हथियार दुनिया में सबसे सस्ते और बेहतरीन साबित होंगे।',
        ],
        detailedNarrative:
          'जो भारत कल तक दुनिया का सबसे बड़ा हथियार आयातक था, वह आज दुनिया को हथियार बेच रहा है। जब भारतीय सेना भारी मात्रा में स्वदेशी उपकरण खरीदेगी, तो फैक्ट्रियों की उत्पादन क्षमता बढ़ेगी और लागत घटेगी। इससे एशिया, अफ्रीका और दक्षिण अमेरिका के मित्र देश पश्चिमी देशों के महंगे हथियारों के बजाय भारत से भरोसेमंद और सस्ते हथियार खरीदेंगे, जिससे भारत को भारी विदेशी मुद्रा की कमाई होगी।',
      },
      {
        id: 'citizen-reality',
        heading: '6. आम आदमी की जिंदगी पर क्या असर पड़ेगा?',
        subheading: 'सुरक्षित सीमाएं, बढ़ता रुपया और टैक्सपेयर के पैसे का सही इस्तेमाल',
        tag: 'जनहित',
        summaryBulletPoints: [
          'देश की सीमाएं सुरक्षित रहने से विदेशी निवेश आता है और देश में विकास बिना रुकावट जारी रहता है।',
          'जनता के टैक्स का पैसा विदेशों में जाने के बजाय देश के अस्पतालों, स्कूलों और सड़कों की तरह देश में ही खर्च होता है।',
          'भारत के छात्रों और युवाओं के लिए डिफेंस-टेक में नए स्टार्टअप्स शुरू करने के असीम अवसर।',
        ],
        detailedNarrative:
          'सुरक्षा कोई अलग मुद्दा नहीं है; यह हर नागरिक के जीवन का आधार है। जब देश की सीमाएं मजबूत होती हैं, तभी देश की अर्थव्यवस्था सुरक्षित रहती है। इस फैसले से आम नागरिक को यह भरोसा मिलता है कि भारत अब किसी के दबाव में नहीं झुकेगा और देश की रक्षा करने वाले जवान दुनिया के सबसे बेहतरीन और स्वदेशी हथियारों से लैस हैं।',
      },
    ],
    publicFaqs: [
      {
        question: 'AoN (एक्सेप्टेंस ऑफ नेसेसिटी) का क्या मतलब है?',
        answer: 'AoN रक्षा मंत्रालय की आधिकारिक वैधानिक मंजूरी है। इसका मतलब है कि सरकार ने मान लिया है कि सेना को इन हथियारों की सख्त जरूरत है और अब कंपनियों के साथ टेंडर व कॉन्ट्रैक्ट की प्रक्रिया शुरू होगी।',
      },
      {
        question: 'Buy Indian-IDDM क्या होता है?',
        answer: 'IDDM का अर्थ है \'स्वदेशी रूप से डिजाइन, विकसित और निर्मित\'। यह भारतीय कानून में रक्षा खरीद की सबसे सख्त श्रेणी है, जिसमें हथियार की तकनीक और कम से कम 50% कलपुर्जे भारत में ही बने होने चाहिए।',
      },
      {
        question: 'क्या इससे आम जनता पर कोई नया टैक्स लगेगा?',
        answer: 'बिल्कुल नहीं! यह बजट पहले से तय रक्षा बजट में से ही खर्च किया जा रहा है। बल्कि विदेशी मुद्रा बचने से देश की वित्तीय स्थिति और मजबूत होगी।',
      },
      {
        question: 'हथियार सेना तक कब तक पहुंचेंगे?',
        answer: 'मंजूरी के बाद 12 से 24 महीनों के भीतर संबंधित भारतीय कंपनियों के साथ कॉन्ट्रैक्ट साइन होकर चरणों में डिलीवरी शुरू हो जाएगी।',
      },
    ],
    jargonList: [
      { term: 'DAC', meaning: 'रक्षा अधिग्रहण परिषद; रक्षा मंत्री की अध्यक्षता वाली सर्वोच्च संस्था जो सेना के लिए हथियारों की खरीद पर अंतिम फैसला लेती है।' },
      { term: 'IDDM', meaning: 'स्वदेशी रूप से डिजाइन, विकसित और निर्मित साजो-सामान।' },
      { term: 'ALH', meaning: 'एडवांस्ड लाइट हेलीकॉप्टर; एचएएल द्वारा निर्मित बहुउपयोगी सैन्य हेलीकॉप्टर जो लद्दाख की ऊंचाइयों में भी उड़ सकता है।' },
      { term: 'इलेक्ट्रॉनिक वॉरफेयर', meaning: 'दुश्मन के रडार और संचार तरंगों को जाम करने और अपने सिग्नलों को सुरक्षित रखने की तकनीक।' },
    ],
    editorialVerdict:
      'रक्षा अधिग्रहण परिषद का ₹97,000 करोड़ का यह फैसला केवल हथियारों की खरीद नहीं, बल्कि भारत को सैन्य महाशक्ति बनाने का ऐतिहासिक घोषणापत्र है। 98% घरेलू निर्माण की शर्त ने यह साबित कर दिया है कि आत्मनिर्भर भारत अब केवल नारा नहीं, बल्कि राष्ट्रीय नीति बन चुका है।',
  },

  'brics-summit': {
    readingTimeMinutes: 5,
    deskName: 'अंतरराष्ट्रीय कूटनीति एवं वैश्विक अर्थव्यवस्था ब्यूरो • नई दिल्ली',
    editorialSubtitle: '18वां ब्रिक्स शिखर सम्मेलन: मोदी-शी सीमा शांति वार्ता, ब्रिक्स लोकल-करेंसी पेमेंट गेटवे और $112 अरब के व्यापार घाटे का पूरा विश्लेषण',
    quickTakeaways: [
      'सीमा पर शांति की अनिवार्यता: पीएम मोदी और शी जिनपिंग में सहमति कि एलएसी पर शांति ही सामान्य रिश्तों की पहली शर्त है।',
      '$112 अरब के व्यापार घाटे पर खरी-खरी: भारत ने चीन के सामने गैर-शुल्क बाधाओं को हटाने और भारतीय दवाओं व आईटी को बाजार देने की मांग रखी।',
      'लोकल करेंसी पेमेंट गेटवे: डॉलर पर निर्भरता कम करने के लिए ब्रिक्स देशों में स्थानीय मुद्राओं में व्यापार निपटाने का डिजिटल नेटवर्क मंजूर।',
      'भारत की कूटनीतिक जीत: ग्लोबल साउथ का नेतृत्व करते हुए भी पश्चिमी देशों के साथ स्वतंत्र रणनीतिक संतुलन कायम रखा।',
    ],
    sections: [
      {
        id: 'summit-event',
        heading: '1. क्या हुआ: नई दिल्ली में 18वें ब्रिक्स शिखर सम्मेलन का समापन',
        subheading: 'नई दिल्ली घोषणापत्र और मोदी-शी जिनपिंग की उच्चस्तरीय सीमा वार्ता',
        tag: 'कूटनीतिक शिखर वार्ता',
        highlightStat: {
          label: 'द्विपक्षीय व्यापार घाटा',
          value: '$112.16 अरब',
          sublabel: 'भारत-चीन व्यापार असंतुलन पर नई दिल्ली का सख्त रुख',
        },
        summaryBulletPoints: [
          'नई दिल्ली में आयोजित 18वें ब्रिक्स सम्मेलन में सभी सदस्य देशों ने सर्वसम्मति से नई दिल्ली घोषणापत्र स्वीकार किया।',
          'प्रधानमंत्री नरेंद्र मोदी और चीनी राष्ट्रपति शी जिनपिंग ने द्विपक्षीय बातचीत में एलएसी पर शांति बहाली की समीक्षा की।',
          'ब्रिक्स देशों ने ऊर्जा और खाद्यान्न व्यापार के लिए स्थानीय मुद्राओं के डिजिटल पेमेंट गेटवे का खाका तैयार किया।',
        ],
        detailedNarrative:
          'नई दिल्ली में संपन्न हुआ 18वां ब्रिक्स शिखर सम्मेलन अंतरराष्ट्रीय राजनीति और अर्थव्यवस्था में एक ऐतिहासिक मोड़ साबित हुआ है। एक तरफ जहां ब्रिक्स देशों ने पश्चिमी बैंकिंग प्रणाली पर निर्भरता कम करने के लिए आपसी मुद्राओं में व्यापार करने का फैसला किया, वहीं दूसरी तरफ प्रधानमंत्री नरेंद्र मोदी ने चीनी राष्ट्रपति शी जिनपिंग से साफ शब्दों में कह दिया कि सीमा पर शांति और पारस्परिक विश्वास के बिना दोनों देशों के रिश्ते सामान्य नहीं हो सकते।',
      },
      {
        id: 'trade-deficit-reality',
        heading: '2. $112 अरब का व्यापार घाटा: चीन के साथ असंतुलन की असली हकीकत',
        subheading: 'भारत केवल चीन का बाजार नहीं बनेगा; भारतीय दवाओं और सॉफ्टवेयर को चाहिए चीनी बाजार',
        tag: 'व्यापार व अर्थव्यवस्था',
        summaryBulletPoints: [
          'भारत चीन से लगभग $118 अरब का सामान खरीदता है लेकिन चीन को केवल $16 अरब का सामान बेच पाता है।',
          'चीन ने भारतीय जेनेरिक दवाओं, आईटी सेवाओं और कृषि उत्पादों पर जानबूझकर कड़े नियम लगाकर उन्हें अपने बाजार में आने से रोका हुआ है।',
          'भारत ने दो टूक कहा कि अगर चीन भारत में अपना सामान बेचना चाहता है, तो उसे भारतीय सामानों के लिए भी अपने दरवाजे खोलने होंगे।',
        ],
        detailedNarrative:
          'भारत और चीन के रिश्तों में केवल सीमा विवाद ही नहीं, बल्कि भारी व्यापारिक असंतुलन भी बहुत बड़ी समस्या है। चीन भारत में मोबाइल फोन, सोलर पैनल और दवाइयों का कच्चा माल बेचकर अरबों डॉलर कमाता है, लेकिन जब भारत की विश्वप्रसिद्ध सस्ती दवाइयों या आईटी सॉफ्टवेयर की बात आती है, तो चीन अजीबोगरीब बहाने बनाकर उन्हें रोक देता है। नई दिल्ली में भारत ने साफ कर दिया कि यह एकतरफा व्यापार अब नहीं चलेगा।',
      },
      {
        id: 'currency-revolution',
        heading: '3. डॉलर की जगह लोकल करेंसी: ब्रिक्स पेमेंट गेटवे का क्या फायदा है?',
        subheading: 'सालाना ₹32,000 करोड़ की विदेशी मुद्रा बचत और प्रतिबंधों से पूर्ण सुरक्षा',
        tag: 'वित्तीय संप्रभुता',
        highlightStat: {
          label: 'सालाना बचत',
          value: '₹32,000 करोड़',
          sublabel: 'डॉलर कन्वर्जन और बैंक कमीशन की सीधी बचत',
        },
        summaryBulletPoints: [
          'ब्रिक्स देशों की आबादी दुनिया की 45% है और इनकी अर्थव्यवस्था पश्चिमी जी-7 देशों से बड़ी हो चुकी है।',
          'अब कच्चा तेल, खाद और मशीनरी खरीदने के लिए अमेरिकी डॉलर की जरूरत नहीं होगी; सीधे रुपये या भागीदार देश की मुद्रा में भुगतान होगा।',
          'अमेरिका या यूरोप द्वारा लगाए जाने वाले बैंकिंग प्रतिबंधों (जैसे स्विफ्ट बैन) का भारत के आयात-निर्यात पर कोई असर नहीं पड़ेगा।',
        ],
        detailedNarrative:
          'यूक्रेन युद्ध के समय जब अमेरिका ने रूस के बैंकों पर प्रतिबंध लगाकर उन्हें डॉलर नेटवर्क से बाहर कर दिया, तब पूरी दुनिया समझ गई कि केवल एक मुद्रा (डॉलर) पर निर्भर रहना कितना खतरनाक है। नई दिल्ली में ब्रिक्स देशों ने ऐसा डिजिटल पेमेंट सिस्टम तैयार किया है जिससे भारत अपने रुपये में ही कच्चा तेल और खाद खरीद सकेगा। इससे न केवल अरबों रुपये का कमीशन बचेगा, बल्कि अंतरराष्ट्रीय संकटों के समय भी भारत की तेल आपूर्ति कभी नहीं रुकेगी।',
      },
      {
        id: 'border-security',
        heading: '4. सीमा पर सुरक्षा: गलवान के बाद एलएसी पर वास्तविक शांति की ओर कदम',
        subheading: 'सैनिकों की वापसी, बफर जोन का प्रबंधन और गश्त के अधिकारों की बहाली',
        tag: 'सीमा सुरक्षा',
        summaryBulletPoints: [
          'डेपसांग और डेमचोक जैसे विवादित क्षेत्रों में गश्त के समझौते के बाद आगे की शांति प्रक्रिया पर सहमति।',
          'दोनों देशों के विशेष प्रतिनिधियों (SR) को नियमित हॉटलाइन और सत्यापन बैठकों का निर्देश।',
          'भारत का स्पष्ट रुख: जब तक चीनी सेना पूरी तरह पीछे नहीं हटेगी, तब तक भारतीय सेना भी मुस्तैद रहेगी।',
        ],
        detailedNarrative:
          '2020 में गलवान घाटी की हिंसक झड़प के बाद से भारत-चीन सीमा पर भारी तनाव रहा है। दोनों देशों ने हजारों सैनिक और तोपें तैनात कर रखी हैं। नई दिल्ली में दोनों नेताओं की मुलाकात में इस बात पर जोर दिया गया कि दोनों देशों की सेनाओं को टकराव वाले बिंदुओं से पीछे हटना चाहिए। हालांकि, भारतीय सेना किसी भी तरह की ढिलाई नहीं बरतेगी; शांति तभी मानी जाएगी जब जमीन पर चीनी सैनिक वास्तव में पीछे हटेंगे।',
      },
      {
        id: 'citizen-impact',
        heading: '5. आम जनता की रसोई और जेब पर इसका क्या असर पड़ेगा?',
        subheading: 'पेट्रोल-डीजल के दाम में स्थिरता, किसानों को सस्ती खाद और सीमावर्ती शांति',
        tag: 'जनता को लाभ',
        summaryBulletPoints: [
          'रुपये में कच्चा तेल खरीदने से पेट्रोल और डीजल के दाम अंतरराष्ट्रीय उतार-चढ़ाव से सुरक्षित रहेंगे।',
          'किसानों के लिए आवश्यक उर्वरक (डीएपी व यूरिया) की निर्बाध और सस्ती आपूर्ति जारी रहेगी।',
          'सीमा पर शांति रहने से देश का पैसा विकास योजनाओं, अस्पतालों और स्कूलों में अधिक लगाया जा सकेगा।',
        ],
        detailedNarrative:
          'शिखर सम्मेलनों की बातें सुनने में भारी लग सकती हैं, लेकिन इनका सीधा असर आपकी जेब पर पड़ता है। जब भारत डॉलर के झंझट के बिना सीधे रुपये में तेल खरीदता है, तो देश में पेट्रोल-डीजल के दाम अचानक नहीं बढ़ते, जिससे रोजमर्रा की दाल, सब्जी और परिवहन का खर्च स्थिर रहता है। किसानों को समय पर सस्ती खाद मिलती है। और जब सीमाएं शांत होती हैं, तो सरकार का ध्यान देश की समृद्धि बढ़ाने पर केंद्रित रहता है।',
      },
      {
        id: 'future-moves',
        heading: '6. भारत की कूटनीतिक जीत: न किसी का पिछलग्गू, न किसी से दुश्मनी',
        subheading: 'क्वाड (Quad) और ब्रिक्स (BRICS) दोनों के बीच स्वतंत्र रणनीतिक संतुलन',
        tag: 'विदेश नीति',
        summaryBulletPoints: [
          'भारत ब्रिक्स का भी प्रमुख नेता है और अमेरिका-जापान वाले क्वाड का भी मजबूत स्तंभ है।',
          'भारत किसी भी देश का पिछलग्गू नहीं बनेगा; जो फैसला 140 करोड़ भारतीयों के हित में होगा, वही लिया जाएगा।',
          'आरबीआई के डिजिटल रुपये (e₹) को अंतरराष्ट्रीय व्यापार से जोड़ने की प्रक्रिया तेज होगी।',
        ],
        detailedNarrative:
          'भारत की मौजूदा विदेश नीति की सबसे बड़ी खूबसूरती उसकी रणनीतिक स्वायत्तता है। भारत न तो चीन के प्रभाव में आता है और न ही पश्चिमी देशों के दबाव में। भारत दोनों पक्षों से अपनी शर्तों पर बात करता है। नई दिल्ली में ब्रिक्स सम्मेलन की सफल मेजबानी करके भारत ने दुनिया को दिखा दिया है कि वह दुनिया के सबसे बड़े लोकतंत्र के रूप में पूरे विकासशील विश्व (ग्लोबल साउथ) की सबसे मजबूत और स्वतंत्र आवाज है।',
      },
    ],
    publicFaqs: [
      {
        question: 'क्या ब्रिक्स के फैसले से अमेरिकी डॉलर बंद हो जाएगा?',
        answer: 'नहीं! अमेरिकी डॉलर दुनिया का बड़ा हिस्सा रहेगा, लेकिन भारत और अन्य देशों के पास अब एक मजबूत विकल्प होगा ताकि डॉलर की कमी या अमेरिकी प्रतिबंधों से हमारा तेल और व्यापार न रुके।',
      },
      {
        question: 'क्या चीन के साथ सीमा विवाद पूरी तरह खत्म हो गया है?',
        answer: 'नहीं, सीमा विवाद पूरी तरह खत्म नहीं हुआ है, लेकिन दोनों देशों ने बातचीत से हल निकालने और सीमा पर शांति बनाए रखने पर सहमति जताई है ताकि 2020 जैसी झड़पें दोबारा न हों।',
      },
      {
        question: 'लोकल करेंसी में व्यापार का भारत को क्या फायदा होगा?',
        answer: 'भारत को विदेशी बैंकों को डॉलर कन्वर्जन फीस नहीं देनी पड़ेगी, सालाना ₹32,000 करोड़ बचेंगे, और हमारा रुपया अंतरराष्ट्रीय स्तर पर मजबूत बनेगा।',
      },
      {
        question: 'आम नागरिक के लिए इस खबर में सबसे जरूरी बात क्या है?',
        answer: 'महंगाई पर नियंत्रण (सस्ता तेल और खाद) और सीमाओं पर शांति, जिससे देश की आर्थिक तरक्की तेजी से चलती रहे।',
      },
    ],
    jargonList: [
      { term: 'ब्रिक्स (BRICS)', meaning: 'दुनिया की उभरती अर्थव्यवस्थाओं का शक्तिशाली संगठन (ब्राजील, रूस, भारत, चीन, दक्षिण अफ्रीका और नए सदस्य यूएई, मिस्र आदि)।' },
      { term: 'व्यापार घाटा (Trade Deficit)', meaning: 'जब हम किसी देश से बहुत ज्यादा सामान खरीदते हैं और उसे बहुत कम बेचते हैं। भारत चीन से $112 अरब ज्यादा खरीदता है।' },
      { term: 'स्विफ्ट (SWIFT)', meaning: 'वैश्विक बैंकों का मैसेजिंग नेटवर्क जिसका इस्तेमाल अंतरराष्ट्रीय स्तर पर पैसे भेजने के लिए होता है।' },
      { term: 'रणनीतिक स्वायत्तता', meaning: 'बिना किसी महाशक्ति के दबाव में आए केवल अपने देश के हित में फैसले लेने की भारत की स्वतंत्र विदेश नीति।' },
    ],
    editorialVerdict:
      'नई दिल्ली का 18वां ब्रिक्स शिखर सम्मेलन भारत की कूटनीतिक शक्ति का प्रतीक बन गया है। सीमा पर शांति की दृढ़ मांग के साथ-साथ डॉलर पर निर्भरता कम करने के इस समझौते ने भारत को 21वीं सदी की विश्व राजनीति में एक अटल और सम्मानित महाशक्ति के रूप में स्थापित किया है।',
  },
};

/**
 * Returns a rich, comprehensive blog article for any given news item and language.
 * Uses curated blog content if available; otherwise dynamically constructs a complete,
 * detailed point-by-point blog editorial with takeaways, stats, FAQs, and jargon buster.
 */
export function getNewsBlogArticle(news: ImpactNewsItem, lang: Language): BlogArticle {
  const isHi = lang === 'hi';
  const localized = getLocalizedNews(news, lang);

  // 1. Check if news item already has a custom blog article attached
  if (isHi && news.hi?.blogArticle) {
    return {
      readingTimeMinutes: 4,
      deskName: news.hi.blogArticle.deskName,
      editorialSubtitle: news.hi.blogArticle.editorialSubtitle,
      quickTakeaways: news.hi.blogArticle.quickTakeaways,
      sections: news.hi.blogArticle.sections.map((s) => ({
        id: s.id,
        heading: s.heading,
        subheading: s.subheading,
        tag: s.tag,
        summaryBulletPoints: s.summaryBulletPoints,
        detailedNarrative: s.detailedNarrative,
        highlightStat: s.highlightStat,
      })),
      publicFaqs: news.hi.blogArticle.publicFaqs,
      jargonList: news.hi.blogArticle.jargonList,
      editorialVerdict: news.hi.blogArticle.editorialVerdict,
    };
  }

  if (!isHi && news.blogArticle) {
    return news.blogArticle;
  }

  // 2. Check for curated matching stories (by ID or keywords)
  const idLower = news.id.toLowerCase();
  const titleLower = news.title.toLowerCase();

  let matchKey: string | null = null;
  if (idLower.includes('yudh-abhyas') || titleLower.includes('yudh abhyas') || titleLower.includes('m-lids') || titleLower.includes('drone')) {
    matchKey = 'yudh-abhyas';
  } else if (idLower.includes('defence') || idLower.includes('makeinindia') || titleLower.includes('hardware procurement') || titleLower.includes('dac') || titleLower.includes('11.6 billion')) {
    matchKey = 'defence-makeinindia';
  } else if (idLower.includes('brics') || titleLower.includes('brics') || titleLower.includes('modi & xi') || titleLower.includes('trade deficit')) {
    matchKey = 'brics-summit';
  }

  if (matchKey) {
    if (isHi && CURATED_BLOGS_HI[matchKey]) {
      const c = CURATED_BLOGS_HI[matchKey]!;
      return {
        readingTimeMinutes: c.readingTimeMinutes || 4,
        deskName: c.deskName || 'राष्ट्रीय सामरिक एवं जन विश्लेषण डेस्क • नई दिल्ली',
        editorialSubtitle: c.editorialSubtitle || localized.summary,
        quickTakeaways: c.quickTakeaways || [
          localized.strategicSummary,
          localized.economicImpact,
          localized.securityImpact,
          localized.primaryAction,
        ],
        sections: (c.sections as BlogArticleSection[]) || [],
        publicFaqs: c.publicFaqs || [],
        jargonList: c.jargonList || [],
        editorialVerdict: c.editorialVerdict || localized.strategicSummary,
      };
    } else if (!isHi && CURATED_BLOGS_EN[matchKey]) {
      const c = CURATED_BLOGS_EN[matchKey]!;
      return {
        readingTimeMinutes: c.readingTimeMinutes || 4,
        deskName: c.deskName || 'National Strategic & Public Intelligence Bureau • New Delhi',
        editorialSubtitle: c.editorialSubtitle || news.summary,
        quickTakeaways: c.quickTakeaways || [
          news.impactOnIndia.strategicSummary,
          news.impactOnIndia.economicImpact,
          news.impactOnIndia.securityImpact,
          news.nextPossibleMoveForIndia.primaryAction,
        ],
        sections: (c.sections as BlogArticleSection[]) || [],
        publicFaqs: c.publicFaqs || [],
        jargonList: c.jargonList || [],
        editorialVerdict: c.editorialVerdict || news.impactOnIndia.strategicSummary,
      };
    }
  }

  // 3. Dynamic comprehensive blog synthesis for all other news items (and custom analyzed items)
  if (isHi) {
    return {
      readingTimeMinutes: 4,
      deskName: 'भारत प्रभाव संपादकीय एवं सामरिक ब्यूरो • नई दिल्ली',
      editorialSubtitle: localized.summary,
      quickTakeaways: [
        `प्रमुख घटना: ${localized.whatHappened.slice(0, 110)}...`,
        `भारत पर प्रभाव: ${localized.strategicSummary.slice(0, 110)}...`,
        `आर्थिक समीकरण: ${localized.economicImpact.slice(0, 110)}...`,
        `भारत का अगला कदम: ${localized.primaryAction.slice(0, 110)}...`,
      ],
      sections: [
        {
          id: 'what-happened-deep',
          heading: '1. क्या हुआ और जमीनी हकीकत: घटना का पूरा विवरण',
          subheading: 'पिछले 24 घंटों में हुए रणनीतिक घटनाक्रम का बिंदु-वार विश्लेषण',
          tag: 'ताज़ा घटनाक्रम',
          highlightStat: {
            label: 'रणनीतिक प्रभाव स्कोर',
            value: `${news.impactScore}/100`,
            sublabel: `रैंक #${news.impactRank} • ${news.impactLevel}`,
          },
          summaryBulletPoints: [
            localized.whatHappened,
            `संबद्ध श्रेणी: ${news.category}`,
            `घटना का समय: ${news.timeAgo} (<24 घंटे)`,
          ],
          detailedNarrative: `${localized.whatHappened} यह घटना भारत के लिए अत्यधिक महत्वपूर्ण समय पर सामने आई है, जहां अंतरराष्ट्रीय कूटनीति और घरेलू सुरक्षा दोनों पर इसका सीधा और गहरा असर देखा जा रहा है। सोशल मीडिया और वैश्विक समाचार एजेंसियों के अनुसार इस पर लगातार अंतरराष्ट्रीय स्तर पर नजर रखी जा रही है।`,
        },
        {
          id: 'why-happening-deep',
          heading: '2. यह स्थिति क्यों बनी: मूल कारण और पिछली कार्रवाई की जड़',
          subheading: 'ऐतिहासिक पृष्ठभूमि और इसके पीछे के वास्तविक ट्रिगर',
          tag: 'कारण व पृष्ठभूमि',
          summaryBulletPoints: [
            localized.whyHappening,
            localized.pastActionTitle ? `पूर्व कदम: ${localized.pastActionTitle}` : 'पूर्व नीतिगत समझौतों की निरंतरता',
            localized.pastActionDetails || 'पूर्व के द्विपक्षीय वार्ताओं और समझौतों का सीधा असर',
          ],
          detailedNarrative: `${localized.whyHappening} यदि इस घटना के ऐतिहासिक पहलुओं को देखें तो यह स्पष्ट होता है कि ${localized.pastActionTitle || 'पूर्व में हुए नीतिगत फैसले'} ने इस दिशा में जमीन तैयार की थी। ${localized.pastActionDetails || ''} यह अचानक हुआ फैसला नहीं है, बल्कि एक सोची-समझी रणनीतिक योजना का परिणाम है।`,
        },
        {
          id: 'india-strategic-impact',
          heading: '3. भारत पर बहुआयामी प्रभाव: कूटनीति, रक्षा और अर्थव्यवस्था',
          subheading: 'देश के राष्ट्रीय हितों, बजट और सीमा सुरक्षा पर असर',
          tag: 'भारत पर प्रभाव',
          highlightStat: {
            label: 'प्रभाव वर्गीकरण',
            value: news.sentimentForIndia === 'FAVORABLE' ? 'सकारात्मक / लाभकारी' : 'जटिल / सतर्कता',
            sublabel: 'राष्ट्रीय हितों के दृष्टिकोण से',
          },
          summaryBulletPoints: [
            `सामरिक प्रभाव: ${localized.strategicSummary}`,
            `आर्थिक व व्यापारिक असर: ${localized.economicImpact}`,
            `राष्ट्रीय सुरक्षा: ${localized.securityImpact}`,
            localized.diasporaOrTradeImpact ? `प्रवासी व व्यापार: ${localized.diasporaOrTradeImpact}` : 'वैश्विक आपूर्ति श्रृंखला में भारत का कद',
          ],
          detailedNarrative: `इस घटना का भारत पर प्रभाव अत्यंत व्यापक है। सामरिक दृष्टिकोण से: ${localized.strategicSummary}। आर्थिक दृष्टि से देखा जाए तो: ${localized.economicImpact}। वहीं सुरक्षा के मोर्चे पर: ${localized.securityImpact}। यह दिखाता है कि भारत अब वैश्विक फैसलों में मात्र एक मूक दर्शक नहीं, बल्कि एक सक्रिय शक्ति है।`,
        },
        {
          id: 'citizen-relevance',
          heading: '4. आम नागरिक और उद्योग पर इसका क्या असर होगा?',
          subheading: 'रोजमर्रा की जिंदगी, नौकरियों, कीमतों और बाजार पर प्रभाव',
          tag: 'जनता के लिए महत्व',
          summaryBulletPoints: [
            'राष्ट्रीय सुरक्षा और आर्थिक स्थिरता में बढ़ोतरी से घरेलू बाजारों में विश्वास बढ़ता है।',
            'संबंधित क्षेत्रों (डिफेंस, टेक, एनर्जी या मैन्युफैक्चरिंग) में नए अवसर और नौकरियां पैदा होती हैं।',
            'वैश्विक स्तर पर भारत की मजबूत स्थिति से देशवासियों और विदेशों में रह रहे भारतीयों का मान बढ़ता है।',
          ],
          detailedNarrative:
            'जब भी कोई बड़ा अंतरराष्ट्रीय फैसला या समझौता होता है, तो उसका असर केवल सरकारी दफ्तरों तक सीमित नहीं रहता। जब भारत की स्थिति मजबूत होती है, तो विदेशी निवेश बढ़ता है, देश में नए उद्योग लगते हैं, और युवाओं को बेहतर रोजगार के साधन मिलते हैं। साथ ही जरूरी सामानों (जैसे ऊर्जा, इलेक्ट्रॉनिक्स और खाद्यान्न) की आपूर्ति बिना रुकावट सुनिश्चित रहती है, जिससे आम आदमी की जेब पर महंगाई का असर कम होता है।',
        },
        {
          id: 'next-steps-roadmap',
          heading: '5. भारत की आगे की रणनीति: अगला कदम क्या होना चाहिए?',
          subheading: 'नीति आयोग और रक्षा-विदेश मंत्रालयों के लिए अनुशंसित रोडमैप',
          tag: 'भविष्य का रोडमैप',
          summaryBulletPoints: [
            `प्राथमिक कदम: ${localized.primaryAction}`,
            ...localized.strategicOptions.map((opt) => `रणनीतिक विकल्प: ${opt}`),
            localized.diplomaticPosturing ? `राजनयिक रुख: ${localized.diplomaticPosturing}` : 'रणनीतिक स्वायत्तता को सर्वोपरि रखना',
          ],
          detailedNarrative: `आगे बढ़ते हुए भारत को अपनी नीति में अत्यंत सक्रिय और व्यावहारिक रुख अपनाना होगा। भारत का पहला काम यह होना चाहिए कि: ${localized.primaryAction}। इसके अलावा ${localized.strategicOptions.join('; ')} जैसे ठोस कदम उठाए जाने चाहिए ताकि भारत अधिकतम लाभ अर्जित कर सके और किसी भी अप्रत्याशित जोखिम से सुरक्षित रहे।`,
        },
      ],
      publicFaqs: [
        {
          question: 'इस खबर का सबसे मुख्य सार क्या है?',
          answer: localized.summary,
        },
        {
          question: 'भारत के लिए यह खबर अच्छी है या चुनौतीपूर्ण?',
          answer: news.sentimentForIndia === 'FAVORABLE'
            ? 'यह खबर भारत के राष्ट्रीय और आर्थिक हितों के लिए बेहद सकारात्मक और लाभदायक है।'
            : 'यह एक जटिल और महत्वपूर्ण विषय है जिसमें भारत को सावधानी और दृढ़ता के साथ अपने हितों की रक्षा करनी होगी।',
        },
        {
          question: 'आम आदमी की जिंदगी में इससे क्या बदलाव आएगा?',
          answer: 'यह कदम देश की सुरक्षा, आर्थिक स्थिरता और उद्योगों को मजबूती देता है, जिससे अंततः रोजगार और आर्थिक विकास को गति मिलती है।',
        },
      ],
      jargonList: [
        { term: 'रणनीतिक प्रभाव (Strategic Impact)', meaning: 'किसी घटना का देश की संप्रभुता, सुरक्षा और अंतरराष्ट्रीय स्थिति पर पड़ने वाला दीर्घकालिक असर।' },
        { term: 'आत्मनिर्भरता (Self-Reliance)', meaning: 'महत्वपूर्ण तकनीकों और रक्षा उपकरणों के लिए विदेशों पर निर्भर न रहकर देश में ही उत्पादन करना।' },
      ],
      editorialVerdict: `${localized.strategicSummary} भारत को अपने राष्ट्रीय हितों को सर्वोपरि रखते हुए इस दिशा में दृढ़ता से आगे बढ़ते रहना होगा।`,
    };
  }

  // English fallback dynamic synthesis
  return {
    readingTimeMinutes: 4,
    deskName: 'India Impact Strategic Affairs & Public Intelligence Bureau • New Delhi',
    editorialSubtitle: news.summary,
    quickTakeaways: [
      `The Core Event: ${news.whatHappened.slice(0, 110)}...`,
      `Strategic Significance: ${news.impactOnIndia.strategicSummary.slice(0, 110)}...`,
      `Economic Scale: ${news.impactOnIndia.economicImpact.slice(0, 110)}...`,
      `Recommended Action: ${news.nextPossibleMoveForIndia.primaryAction.slice(0, 110)}...`,
    ],
    sections: [
      {
        id: 'what-happened-deep',
        heading: '1. What Happened: Fact Sheet and Ground Reality',
        subheading: 'A Detailed Breakdown of the Last 24 Hours of Strategic Developments',
        tag: 'Operational Update',
        highlightStat: {
          label: 'Impact Rank & Score',
          value: `#${news.impactRank} • ${news.impactScore}/100`,
          sublabel: `${news.impactLevel} Priority for India`,
        },
        summaryBulletPoints: [
          news.whatHappened,
          `Category: ${news.category}`,
          `Published: ${news.timeAgo} (<24h verified timeline)`,
        ],
        detailedNarrative: `${news.whatHappened} This development arrives at a critical strategic inflection point for India, where shifts in regional balance directly intersect with domestic technological resilience and defense preparedness. Tracked continuously across global wire services and social discourse, this event reflects the accelerating velocity of global geopolitical recalibrations.`,
      },
      {
        id: 'why-happening-deep',
        heading: '2. The Underlying Triggers: Root Causes & Past Precedents',
        subheading: 'Why This Event Unfolded Now and Which Historic Actions Triggered It',
        tag: 'Causal Origins',
        summaryBulletPoints: [
          news.whyHappening,
          news.pastActionOrigin?.hasPastAction ? `Precursor Action: ${news.pastActionOrigin.actionTitle} (${news.pastActionOrigin.actionYearOrPeriod})` : 'Continuous Strategic Policy Evolution',
          news.pastActionOrigin?.details || 'Traces directly back to bilateral agreements and security deliberations.',
        ],
        detailedNarrative: `${news.whyHappening} Examining the causal chain reveals that this is not an isolated flashpoint, but rather a direct outcome of ${news.pastActionOrigin?.actionTitle || 'prior structural policy initiatives'}. ${news.pastActionOrigin?.details || ''} Recognizing these historical linkages is crucial for understanding why both domestic and global actors have moved decisively at this juncture.`,
      },
      {
        id: 'india-strategic-impact',
        heading: '3. Multi-Pillar Impact on India: Strategy, Economy & Defense',
        subheading: 'How This Reshapes National Power, Financial Balances, and Frontier Readiness',
        tag: 'National Impact',
        highlightStat: {
          label: 'Sentiment for India',
          value: news.sentimentForIndia === 'FAVORABLE' ? 'Favorable / Strategic Win' : 'Complex / Watchful',
          sublabel: 'National Interest Evaluation',
        },
        summaryBulletPoints: [
          `Strategic Posture: ${news.impactOnIndia.strategicSummary}`,
          `Economic Dimensions: ${news.impactOnIndia.economicImpact}`,
          `National Security: ${news.impactOnIndia.securityImpact}`,
          news.impactOnIndia.diasporaOrTradeImpact ? `Diaspora & Trade: ${news.impactOnIndia.diasporaOrTradeImpact}` : 'Global supply chain positioning and institutional prestige.',
        ],
        detailedNarrative: `The ramifications for India are multifaceted and far-reaching. Strategically: ${news.impactOnIndia.strategicSummary}. Economically: ${news.impactOnIndia.economicImpact}. From a national security standpoint: ${news.impactOnIndia.securityImpact}. These interlocking layers underscore that India is operating not merely as a regional stakeholder, but as a central pole shaping international outcomes.`,
      },
      {
        id: 'citizen-relevance',
        heading: '4. What This Means for Everyday Citizens and Industry',
        subheading: 'Translating Global Geopolitics into Everyday Economic and Social Realities',
        tag: 'Public Value',
        summaryBulletPoints: [
          'Strengthens economic stability and safeguards crucial energy, tech, and raw material supply corridors.',
          'Spurs domestic industrial opportunities and STEM employment across manufacturing and technology sectors.',
          'Reinforces sovereign border security, allowing uninterrupted domestic investments in infrastructure and social welfare.',
        ],
        detailedNarrative:
          'Geopolitical events inevitably reverberate into the daily lives of citizens. By securing vital energy lanes, ensuring domestic production of critical hardware, and asserting regional deterrence, such milestones protect households from volatile imported inflation while opening up high-skilled industrial careers for Indian youth.',
      },
      {
        id: 'next-steps-roadmap',
        heading: '5. What India Must Do Next: Strategic Roadmap and Tactical Options',
        subheading: 'Actionable Priorities for Policymakers and Defense Leadership',
        tag: 'Future Action',
        summaryBulletPoints: [
          `Primary Directive: ${news.nextPossibleMoveForIndia.primaryAction}`,
          ...news.nextPossibleMoveForIndia.strategicOptions.map((opt) => `Policy Option: ${opt}`),
          news.nextPossibleMoveForIndia.diplomaticPosturing ? `Diplomatic Posture: ${news.nextPossibleMoveForIndia.diplomaticPosturing}` : 'Champion strategic autonomy and resilient multi-lateral partnerships.',
        ],
        detailedNarrative: `To consolidate these advantages and mitigate residual risks, New Delhi must execute a proactive operational playbook. The foremost imperative is to: ${news.nextPossibleMoveForIndia.primaryAction}. In parallel, implementing options such as ${news.nextPossibleMoveForIndia.strategicOptions.join('; ')} will ensure that India stays ahead of strategic competitors and secures enduring national resilience.`,
      },
    ],
    publicFaqs: [
      {
        question: 'What is the core takeaway of this news story?',
        answer: news.summary,
      },
      {
        question: 'Is this development favorable or disadvantageous for India?',
        answer: news.sentimentForIndia === 'FAVORABLE'
          ? 'This is fundamentally favorable for India\'s national interests, defense posture, and economic leverage.'
          : 'This represents a nuanced strategic development requiring vigilant diplomacy and robust domestic defensive measures.',
      },
      {
        question: 'How does this impact the common Indian citizen?',
        answer: 'It fosters national security, stabilizes key supply lines, protects jobs and industry, and enhances India\'s standing on the global stage.',
      },
    ],
    jargonList: [
      { term: 'Strategic Impact', meaning: 'The long-term consequence of an international event on a nation\'s sovereignty, security, and economic independence.' },
      { term: 'Strategic Autonomy', meaning: 'The sovereign freedom to take independent policy decisions solely in the interest of the nation without bowing to foreign pressure.' },
    ],
    editorialVerdict: `${news.impactOnIndia.strategicSummary} India must remain resolute in pursuing its sovereign priorities while cementing its role as a stabilizing global force.`,
  };
}
