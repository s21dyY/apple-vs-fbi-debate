// All facts used in the deck, with the source each one comes from.
// Source ids (S1, S2, ...) match the "Sources" slide and the printed notes.

export const TEAM = [
  'Anika Sriram',
  'Gavin Liu',
  'Sandy Yang',
  'Shreyas Anand',
  'Tianyue Yin',
  'Yule Xi',
  'Ziming Xu',
];

export const SOURCES = [
  {
    id: 'S1',
    cite: 'Apple. (2016, February 16). A message to our customers.',
    url: 'https://www.apple.com/customer-letter/',
  },
  {
    id: 'S2',
    cite: 'Harvard Journal of Law & Technology. (2016, March 29). Federal court orders Apple to unlock iPhone; Apple refuses. JOLT Digest.',
    url: 'https://jolt.law.harvard.edu/digest/federal-court-orders-apple-to-unlock-iphone-apple-refuses',
  },
  {
    id: 'S3',
    cite: 'CSO Online. (2016, February 17). Apple ordered to backdoor San Bernardino shooter\'s iPhone.',
    url: 'https://www.csoonline.com/article/3033880/apple-ordered-to-backdoor-san-bernardino-shooters-iphone.html',
  },
  {
    id: 'S4',
    cite: 'Fortune. (2016, March 28). U.S. withdraws legal action against Apple after accessing iPhone.',
    url: 'https://fortune.com/2016/03/28/u-s-withdraw-legal-action-apple/',
  },
  {
    id: 'S5',
    cite: 'U.S. Department of Justice, Office of the Inspector General. (2018, March). A special inquiry regarding the accuracy of FBI statements concerning its capabilities to exploit an iPhone seized during the San Bernardino terror attack investigation.',
    url: 'https://www.oversight.gov/sites/default/files/oig-reports/o1803.pdf',
  },
  {
    id: 'S6',
    cite: 'TechCrunch. (2018, March 27). Inquiry finds FBI sued Apple to unlock phone without considering all options.',
    url: 'https://techcrunch.com/2018/03/27/inquiry-finds-fbi-sued-apple-to-unlock-phone-without-considering-all-options/',
  },
  {
    id: 'S7',
    cite: 'The Register. (2021, April 14). Australian firm Azimuth reportedly unlocked the San Bernardino iPhone for the FBI (citing The Washington Post).',
    url: 'https://www.theregister.com/2021/04/14/azimuth_fbi_iphone/',
  },
  {
    id: 'S8',
    cite: 'NPR. (2018, May 23). FBI over-counted encrypted phones connected to crimes, by a lot (citing The Washington Post).',
    url: 'https://www.npr.org/sections/thetwo-way/2018/05/23/613763355/fbi-over-counted-encrypted-phones-connected-to-crimes-by-a-lot',
  },
  {
    id: 'S9',
    cite: 'Pew Research Center. (2016, February 22). More support for Justice Department than for Apple in dispute over unlocking iPhone.',
    url: 'https://www.pewresearch.org/politics/2016/02/22/more-support-for-justice-department-than-for-apple-in-dispute-over-unlocking-iphone/',
  },
  {
    id: 'S10',
    cite: 'U.S. Department of Justice. (2020, May 18). Attorney General William P. Barr and FBI Director Christopher Wray announce significant developments in the investigation of the Naval Air Station Pensacola shooting.',
    url: 'https://www.justice.gov/opa/pr/attorney-general-william-p-barr-and-fbi-director-christopher-wray-announce-significant',
  },
  {
    id: 'S11',
    cite: 'MacRumors. (2020, May 18). Apple calls FBI comments on lack of help unlocking Florida shooter\'s iPhone an "excuse to weaken encryption."',
    url: 'https://www.macrumors.com/2020/05/18/apple-fbi-dispute-weaken-encryption/',
  },
  {
    id: 'S12',
    cite: 'The Register. (2024, October 7). Verizon, AT&T, Lumen reportedly hacked by China\'s Salt Typhoon (citing The Wall Street Journal).',
    url: 'https://www.theregister.com/2024/10/07/verizon_att_lumen_salt_typhoon/',
  },
  {
    id: 'S13',
    cite: 'TechCrunch. (2024, December 4). FBI recommends encrypted messaging apps to combat Chinese hackers.',
    url: 'https://techcrunch.com/2024/12/04/fbi-recommends-encrypted-messaging-apps-combat-chinese-hackers/',
  },
  {
    id: 'S14',
    cite: 'Al Jazeera. (2025, August 19). UK agrees to drop mandate for Apple "back door," US spy chief says.',
    url: 'https://www.aljazeera.com/economy/2025/8/19/uk-drops-mandate-for-apple-back-door-us-spy-chief-says',
  },
  {
    id: 'S15',
    cite: 'Abelson, H., Anderson, R., Bellovin, S. M., et al. (2015). Keys under doormats: Mandating insecurity by requiring government access to all data and communications. Journal of Cybersecurity, 1(1).',
    url: 'https://dspace.mit.edu/handle/1721.1/97690',
  },
  {
    id: 'S16',
    cite: 'SecurityWeek. (2025, July 30). Cost of data breach in US rises to $10.22 million, says latest IBM report.',
    url: 'https://www.securityweek.com/cost-of-data-breach-in-us-rises-to-10-22-million-says-latest-ibm-report/',
  },
  {
    id: 'S17',
    cite: 'Apple. (2025). Transparency report: United States, July to December 2024.',
    url: 'https://www.apple.com/legal/transparency/us/h2-2024.html',
  },
  {
    id: 'S18',
    cite: 'MacRumors. (2025, January 30). Apple\'s Q1 2025 earnings call takeaways.',
    url: 'https://www.macrumors.com/2025/01/30/apple-q1-2025-earnings-call-takeaways/',
  },
];

// Exhibit 1: FBI "going dark" count (S8)
export const FBI_COUNT = {
  claimed: 7775,
  actualLow: 1000,
  actualHigh: 2000,
};

// Exhibit 2: Pew, Feb 18-21, 2016, n = 1,002 U.S. adults (S9)
export const PEW = [
  { key: 'unlock', label: 'Apple should unlock', value: 51 },
  { key: 'not', label: 'Apple should not unlock', value: 38 },
  { key: 'none', label: 'No opinion', value: 11 },
];
export const PEW_SUBGROUPS = [
  { label: 'All adults', unlock: 51, not: 38 },
  { label: 'Ages 18-29', unlock: 47, not: 43 },
  { label: 'iPhone owners', unlock: 47, not: 43 },
];

// Exhibit 3: Apple U.S. transparency report, Jul-Dec 2024 (S17)
export const TRANSPARENCY = [
  { label: 'Device requests', received: 8614, pct: 73 },
  { label: 'Account requests', received: 15780, pct: 82 },
];

export const TIMELINE = [
  { date: 'Dec 2, 2015', text: 'San Bernardino attack, 14 killed (S2). Shooter\'s work iPhone 5C is recovered, locked.' },
  { date: 'Feb 16, 2016', text: 'Magistrate Judge Sheri Pym orders Apple to help, under the All Writs Act of 1789 (S2).' },
  { date: 'Feb 16, 2016', text: 'Tim Cook\'s open letter: "They have asked us to build a backdoor to the iPhone" (S1).' },
  { date: 'Mar 28, 2016', text: 'DOJ drops the case: a third party got in, Apple\'s help "no longer" needed (S4).' },
  { date: 'Mar 2018', text: 'DOJ Inspector General: FBI had not exhausted other options before suing (S5, S6).' },
  { date: 'May 2018', text: 'FBI admits its count of locked phones (7,775) was inflated (S8).' },
  { date: 'May 2020', text: 'FBI unlocks the Pensacola shooter\'s iPhones itself, again without a backdoor (S10).' },
  { date: 'Oct-Dec 2024', text: 'Salt Typhoon hacks U.S. carriers; FBI and CISA tell Americans to use encryption (S12, S13).' },
  { date: 'Feb-Aug 2025', text: 'UK secret backdoor order: Apple pulls Advanced Data Protection in the UK; UK drops the U.S. demand (S14).' },
];
