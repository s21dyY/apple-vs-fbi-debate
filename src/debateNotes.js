// Printable debate prep. No devices are allowed in the debate, so these print
// with the slides (press P in the deck, or open the page with ?print).

export const DEBATE_NOTES = {
  intro:
    'Each team gets 60 seconds per question. Answer in three beats: (1) our claim, (2) one fact with its source, (3) why it matters for Apple and the public. Source ids (S1, S2...) match the source list at the end.',

  oneLiner:
    'Apple should refuse to build a backdoor, because a tool that unlocks one iPhone unlocks them all, and the FBI has shown it can solve cases without one, while Apple keeps helping through every lawful channel.',

  numbers: [
    { value: '14', fact: 'People killed in San Bernardino, Dec 2, 2015', src: 'S2' },
    { value: '1789', fact: 'Year of the All Writs Act, the law behind the order', src: 'S2' },
    { value: '3 + signing', fact: 'Order: disable auto-erase, allow electronic passcodes, remove delays, deliver Apple-signed software', src: 'S3' },
    { value: '6 weeks', fact: 'Order (Feb 16) to DOJ dropping the case (Mar 28, 2016)', src: 'S2, S4' },
    { value: '10 guesses vs. 13 min', fact: 'iPhone as shipped: 10 tries, delays, then erase. With the ordered tool: every 4-digit code in ~13 min, 6-digit in ~22 h (~80 ms/guess)', src: 'S19' },
    { value: '"90 percent"', fact: 'How close an outside vendor was to unlocking the phone when the FBI sued', src: 'S6' },
    { value: '~$900,000', fact: 'Reported FBI payment to Azimuth to unlock the phone; reportedly "nothing of value" on it', src: 'S7' },
    { value: '7,775 vs 1,000–2,000', fact: 'FBI\'s 2017 locked-phone claim vs. Washington Post estimate of the real number', src: 'S8' },
    { value: '51% / 38% / 11%', fact: 'Pew 2016: unlock / do not unlock / no opinion (18–29 year olds: 47% / 43%)', src: 'S9' },
    { value: '4+ months', fact: 'Time for the FBI to open the Pensacola shooter\'s iPhones itself (2020)', src: 'S10' },
    { value: '73% / 82%', fact: 'U.S. device / account requests where Apple provided data, Jul–Dec 2024', src: 'S17' },
    { value: '2.35 billion+', fact: 'Apple active devices worldwide (Jan 2025)', src: 'S18' },
    { value: '$10.22M / $4.44M', fact: 'Average data breach cost, U.S. / worldwide, 2025 (IBM)', src: 'S16' },
    { value: '"Encryption is your friend"', fact: 'CISA official after the Salt Typhoon telecom hack, Dec 2024', src: 'S13' },
  ],

  questions: [
    {
      q: 'Is the government asking for access to one device, or a master key?',
      a: 'In form it is one phone, but in effect it is a master key. The order made Apple write new software that removes auto-erase and guess limits, and sign it so iPhones trust it (S3). Tying it to one phone ID is a single line of code that can be changed. As Cook wrote, "once created, the technique could be used over and over again, on any number of devices" (S1). And the Inspector General\'s report quotes an FBI official calling this case the "poster child" for going dark (S6), which shows the real goal was a precedent.',
    },
    {
      q: 'Doesn\'t strong encryption create a safe haven for criminals?',
      a: 'It makes some cases harder, but the evidence shows the FBI is not blind. It opened the San Bernardino phone without Apple in six weeks (S4) and the Pensacola phones in about four months (S10). Its own count of locked phones was inflated about four to eight times (S8). And investigators still get iCloud backups, account data and metadata: Apple gave data in 73% of U.S. device requests in late 2024 (S17).',
    },
    {
      q: 'What precedent is set if tech companies are forced to help?',
      a: 'A judge could use a 1789 law to make any company write surveillance code, with no vote by Congress (S2). Other governments will ask for the same: in 2025 the UK secretly demanded access to encrypted iCloud data, and Apple pulled its strongest iCloud protection from UK users instead (S14). If Apple says yes to the FBI, it cannot say no to the next country.',
    },
    {
      q: 'How does this affect privacy, security and public safety?',
      a: 'A backdoor is a door anyone can walk through. In 2024 Chinese hackers broke into AT&T, Verizon and Lumen and may have reached wiretap systems built for police (S12). Right after, the FBI and CISA told Americans to use encrypted apps (S13). So weakening encryption does not make the public safer; it hands a key to criminals and spies. Breaches already average $10.22 million in the U.S. (S16).',
    },
    {
      q: 'What should Tim Cook do, specifically?',
      a: 'Four things. Refuse to build or sign the software and fight the order in court. Keep answering warrants quickly with all data Apple holds, as it did in Pensacola within hours (S11). Keep publishing transparency reports (S17). And ask Congress, not a court using a 1789 law, to set clear rules, while supporting better forensic training for police.',
    },
    {
      q: 'What is the business case (ROI) for Apple?',
      a: 'Trust is Apple\'s product. It has over 2.35 billion active devices (S18), and privacy sets it apart from rivals whose business depends on user data. A leaked unlocking tool would put every one of those devices at risk, and breaches average $10.22 million in the U.S. (S16). Saying no protects the brand and avoids that liability.',
    },
    {
      q: 'What about the victims\' families?',
      a: 'Their loss is real and the attack was horrific. That is exactly why Apple helped from day one with all the data it had. But the phone was opened without a backdoor (S4) and reportedly held nothing of value (S7). Weakening a billion phones would not have saved anyone in this case, and it would put millions of other families at risk.',
    },
  ],

  rebuttals: [
    {
      claim: 'A court can order a locked safe opened, so why not a phone?',
      answer: 'A court can order a locksmith to open one safe. It cannot order a lock maker to design a key that opens every safe it ever sold. That is the difference: the order required Apple to create a new tool, not just open a door (S3).',
    },
    {
      claim: 'It is just one phone, for a terrorism case.',
      answer: 'The FBI dropped the case once a vendor got in (S4), which shows it never needed Apple. The Inspector General found it went to court without trying all options (S6). If the need was one phone, the case would not have been the "poster child" for going dark (S6).',
    },
    {
      claim: 'Thousands of phones with evidence are locked.',
      answer: 'The FBI\'s own number was wrong: it claimed 7,775 phones, and the Washington Post estimated 1,000 to 2,000 (S8). The FBI blamed a programming error. Policy should not be built on a number the FBI itself withdrew.',
    },
    {
      claim: 'Pensacola proves Apple blocks terrorism cases.',
      answer: 'In Pensacola, Apple responded within hours and gave iCloud backups, account information and transaction data (S11). The FBI then opened the phones itself (S10). That is our model working: lawful help plus police forensics, with no backdoor.',
    },
    {
      claim: 'Most Americans sided with the FBI.',
      answer: 'In 2016, 51% did, but young adults and iPhone owners were split 47% to 43% (S9). And opinion is not technical reality: in 2024 the FBI itself urged Americans to use encryption (S13).',
    },
    {
      claim: 'Only the good guys would hold the key.',
      answer: 'Salt Typhoon shows what happens: systems built for lawful wiretaps were reportedly reached by Chinese hackers (S12). Fifteen top security experts warned that mandated access causes even greater damage today (S15). As Apple put it, "there is no such thing as a backdoor just for the good guys" (S11).',
    },
  ],

  weakSpots: [
    {
      issue: 'Pensacola: the FBI did find al-Qaeda links on the phones (S10).',
      pivot: 'Agree, and note the FBI found them without a backdoor. The case supports lawful hacking and fast cooperation, which is our recommendation.',
    },
    {
      issue: 'It took the FBI four months to open the Pensacola phones (S10).',
      pivot: 'Admit it is slower. Then compare: a slower path in a few cases vs. a permanent weakness in over 2.35 billion devices (S18). Our plan funds faster police forensics.',
    },
    {
      issue: '"Apple helps other governments, so why not the U.S.?"',
      pivot: 'Apple follows local laws for data it holds, which is why it publishes transparency reports (S17). But when the UK demanded a backdoor, Apple pulled the feature rather than build one (S14). The line is the same everywhere: no backdoors.',
    },
    {
      issue: '"Privacy is just Apple\'s marketing."',
      pivot: 'Even if it is good marketing, the incentive points the right way: Apple makes money when users trust it. And the FBI and CISA, not Apple, are the ones who told Americans "encryption is your friend" (S13).',
    },
  ],
};
