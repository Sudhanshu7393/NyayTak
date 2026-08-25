export const DOCUMENT_TEMPLATES = [
  {
    id: "police-complaint",
    name_hi: "पुलिस शिकायत पत्र (Police Complaint)",
    name_en: "Police Complaint Letter",
    fields: [
      { id: "senderName", label_hi: "आपका नाम (Sender Name)", label_en: "Your Name", type: "text", placeholder: "e.g., Sudhanshu Pandey" },
      { id: "senderPhone", label_hi: "मोबाइल नंबर (Mobile)", label_en: "Mobile No.", type: "text", placeholder: "e.g., 9876543210" },
      { id: "stationName", label_hi: "थाने का नाम (Police Station)", label_en: "Police Station Name", type: "text", placeholder: "e.g., Hazratganj Police Station, Lucknow" },
      { id: "opponentName", label_hi: "आरोपी का नाम (Accused Name)", label_en: "Accused Name (if known)", type: "text", placeholder: "e.g., Unknown / John Doe" },
      { id: "incidentDate", label_hi: "घटना की तारीख (Incident Date)", label_en: "Date of Incident", type: "date" },
      { id: "incidentPlace", label_hi: "घटना का स्थान (Incident Place)", label_en: "Place of Incident", type: "text", placeholder: "e.g., Hazratganj Chauraha" },
      { id: "details", label_hi: "शिकायत का विवरण (Incident Details)", label_en: "Description of Incident", type: "textarea", placeholder: "Explain exactly what happened..." }
    ],
    template_hi: `सेवा में,
थाना प्रभारी महोदय,
{{stationName}}

विषय: घटना के संबंध में प्राथमिक शिकायत पत्र (FIR हेतु)।

महोदय,

सविनय निवेदन है कि मेरा नाम {{senderName}} है। मैं शिकायत दर्ज करवाना चाहता हूँ कि दिनांक {{incidentDate}} को स्थान {{incidentPlace}} पर मेरे साथ एक घटना घटित हुई।

घटना का विवरण इस प्रकार है:
{{details}}

इस घटना में आरोपी का नाम {{opponentName}} है (या यदि कोई अन्य हो)। इस घटना से मुझे शारीरिक/मानसिक/आर्थिक नुकसान हुआ है। मेरा मोबाइल नंबर {{senderPhone}} है।

अतः आपसे विनम्र निवेदन है कि कृपया इस शिकायत को संज्ञान में लेते हुए उचित कानूनी कार्रवाई (FIR दर्ज करना) शुरू करने की कृपा करें।

भवदीय,
{{senderName}}
हस्ताक्षर: _________________
दिनांक: {{incidentDate}}`,
    template_en: `To,
The Officer-in-Charge,
{{stationName}}

Subject: Formal Police Complaint regarding the incident on {{incidentDate}}.

Respected Sir/Madam,

I, {{senderName}}, resident/contactable at {{senderPhone}}, wish to bring to your immediate attention a criminal incident that occurred on {{incidentDate}} at {{incidentPlace}}.

The details of the incident are as follows:
{{details}}

The person(s) involved/accused in this matter is/are {{opponentName}}. This incident has caused me significant distress/damage.

Therefore, I kindly request you to register this formal complaint, initiate an immediate investigation, and file a First Information Report (FIR) under the relevant sections of the Bharatiya Nyaya Sanhita (BNS).

Thank you.

Yours faithfully,
{{senderName}}
Signature: _________________
Date: {{incidentDate}}`
  },
  {
    id: "rti-application",
    name_hi: "आरटीआई आवेदन पत्र (RTI Application)",
    name_en: "RTI Application (Right to Information)",
    fields: [
      { id: "senderName", label_hi: "आपका नाम (Your Name)", label_en: "Your Name", type: "text", placeholder: "e.g., Rajesh Kumar" },
      { id: "senderAddress", label_hi: "आपका पता (Address)", label_en: "Your Address", type: "text", placeholder: "e.g., Flat 101, Sector 4, Noida" },
      { id: "pioOffice", label_hi: "PIO / कार्यालय का नाम (Public Authority Office)", label_en: "Public Authority / PIO Office", type: "text", placeholder: "e.g., Public Information Officer, Municipal Corporation, Lucknow" },
      { id: "infoNeeded", label_hi: "वांछित जानकारी (Information Sought)", label_en: "Information Needed", type: "textarea", placeholder: "List the exact questions or files you want to inspect..." },
      { id: "ipoNumber", label_hi: "पोस्टल आर्डर संख्या (IPO/Fee Receipt Number)", label_en: "IPO/Fee Details (Rs. 10)", type: "text", placeholder: "e.g., IPO No. 56F 123456" }
    ],
    template_hi: `सूचना का अधिकार अधिनियम, 2005 की धारा 6(1) के तहत आवेदन

सेवा में,
लोक सूचना अधिकारी (PIO),
{{pioOffice}}

1. आवेदक का नाम: {{senderName}}
2. आवेदक का पता: {{senderAddress}}
3. वांछित सूचना का विवरण:
कृपया मुझे निम्नलिखित जानकारी प्रदान करें:
{{infoNeeded}}

4. मैं प्रमाणित करता हूँ कि मैं भारत का नागरिक हूँ।
5. आवेदन शुल्क के रूप में ₹10/- का भुगतान पोस्टल आर्डर संख्या: {{ipoNumber}} के माध्यम से संलग्न है।

यदि मांगी गई जानकारी आपके विभाग से संबंधित नहीं है, तो कृपया आर.टी.आई. अधिनियम की धारा 6(3) के तहत इसे संबंधित विभाग को 5 दिनों के भीतर स्थानांतरित करें।

आवेदक का नाम: {{senderName}}
हस्ताक्षर: _________________
पता: {{senderAddress}}
दिनांक: {{ipoNumber}}`,
    template_en: `Application under Section 6(1) of the Right to Information Act, 2005

To,
The Public Information Officer (PIO),
{{pioOffice}}

1. Full Name of Applicant: {{senderName}}
2. Correspondence Address: {{senderAddress}}
3. Description of Information Sought:
Please provide the following information under the RTI Act:
{{infoNeeded}}

4. Citizenship: I hereby state that I am a citizen of India.
5. Fee Details: A fee of Rs. 10/- has been paid via Postal Order/Demand Draft/Receipt No: {{ipoNumber}}.

Note: If the requested information falls under the jurisdiction of another public authority, please transfer this application under Section 6(3) of the RTI Act within 5 days and inform me.

Yours sincerely,
{{senderName}}
Signature: _________________
Correspondence Address: {{senderAddress}}`
  },
  {
    id: "legal-notice",
    name_hi: "कानूनी नोटिस - बकाया वसूली (Legal Notice - Dues)",
    name_en: "Legal Notice for Dues Recovery",
    fields: [
      { id: "senderName", label_hi: "आपका नाम (Client/Sender)", label_en: "Your Name", type: "text", placeholder: "e.g., Anil Verma" },
      { id: "opponentName", label_hi: "विपक्षी का नाम (Debtor Name)", label_en: "Debtor / Opponent Name", type: "text", placeholder: "e.g., Amit Singh" },
      { id: "opponentAddress", label_hi: "विपक्षी का पता (Debtor Address)", label_en: "Debtor Address", type: "text", placeholder: "e.g., Sector 12, Indiranagar, Lucknow" },
      { id: "dueAmount", label_hi: "बकाया राशि (Due Amount in ₹)", label_en: "Due Amount (INR)", type: "text", placeholder: "e.g., ₹50,000" },
      { id: "dueDate", label_hi: "भुगतान की आखिरी तारीख (Last Due Date)", label_en: "Original Due Date", type: "date" },
      { id: "noticePeriod", label_hi: "कार्रवाई हेतु समय सीमा (Notice Period in Days)", label_en: "Notice Period (Days)", type: "text", placeholder: "e.g., 15" }
    ],
    template_hi: `पंजीकृत ए.डी. / स्पीड पोस्ट द्वारा प्रेषित

कानूनी नोटिस

सेवा में,
{{opponentName}}
पता: {{opponentAddress}}

महोदय,

मेरे क्लाइंट/पक्षकार श्री {{senderName}} की ओर से और उनके निर्देशानुसार, मैं आपको निम्नलिखित कानूनी नोटिस प्रेषित कर रहा हूँ:

1. यह कि आपने मेरे क्लाइंट से व्यावसायिक लेनदेन/ऋण के अंतर्गत कुल राशि {{dueAmount}} उधार ली थी, जिसे आपको दिनांक {{dueDate}} तक वापस लौटाना था।
2. यह कि मेरे क्लाइंट ने कई बार मौखिक और लिखित रूप से आपसे संपर्क किया, लेकिन आपने उक्त राशि का भुगतान करने में टालमटोल की।
3. यह कि आपकी यह कार्रवाई विश्वासघात, धोखाधड़ी और कानूनी अनुबंध का उल्लंघन है।

अतः इस नोटिस के माध्यम से आपको निर्देशित किया जाता है कि इस नोटिस की प्राप्ति के {{noticePeriod}} दिनों के भीतर मेरे क्लाइंट को उक्त राशि {{dueAmount}} ब्याज सहित भुगतान करें। अन्यथा मेरे क्लाइंट आपके विरुद्ध दीवानी एवं आपराधिक न्यायालय में मुकदमा दायर करने के लिए विवश होंगे, जिसके समस्त खर्चे और हर्जाने के जिम्मेदार आप स्वयं होंगे।

दिनांक: _______________

श्री {{senderName}} की ओर से,
(हस्ताक्षर/वकील)`,
    template_en: `BY REGISTERED A.D. / SPEED POST

LEGAL NOTICE

To,
{{opponentName}}
Address: {{opponentAddress}}

Dear Sir/Madam,

Under instructions from and on behalf of my client {{senderName}}, I hereby serve you with the following Legal Notice:

1. That you entered into an agreement/transaction with my client and agreed to pay/return a sum of {{dueAmount}} on or before {{dueDate}}.
2. That despite the expiry of the due date and multiple follow-ups, you have failed to discharge your liability and clear the outstanding dues of {{dueAmount}}.
3. That your failure to pay constitutes a breach of trust, contract, and wrongful withholding of my client's lawful money.

I hereby call upon you to pay the entire outstanding sum of {{dueAmount}} to my client within {{noticePeriod}} days from the receipt of this legal notice. Failing this, my client will be constrained to initiate appropriate civil and criminal proceedings against you in a court of law, entirely at your own cost and consequence.

Copy kept for records.

On behalf of {{senderName}},
(Signature/Counsel)`
  }
];
