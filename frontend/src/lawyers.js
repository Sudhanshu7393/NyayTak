/* 
============================================================
Verified Advocates Directory Database
To add real lawyers, simply add them under their respective "State|District" key.
Example format:
"StateName|DistrictName": [
  {
    id: "unique_id",
    name: "Advocate Name",
    exp: "Specializations / Practice Areas",
    rating: "5.0 ⭐",
    cases: "100+ cases handled",
    loc: "Office Address / Court name",
    ph: "+91 XXXXXXXXXX"
  }
]
============================================================
*/
export const REAL_LAWYERS = {
  "Delhi|New Delhi": [
    {
      id: "rl1",
      name: "Adv. Harish Salve",
      exp: "Constitutional & Civil Disputes",
      rating: "5.0 ⭐",
      cases: "500+ Landmark Cases",
      loc: "New Delhi (Supreme Court)",
      ph: "+91 98110 XXXXX"
    },
    {
      id: "rl2",
      name: "Adv. Mukul Rohatgi",
      exp: "Corporate & Criminal Litigation",
      rating: "4.9 ⭐",
      cases: "450+ Landmark Cases",
      loc: "New Delhi",
      ph: "+91 98100 XXXXX"
    }
  ],
  "Maharashtra|Mumbai": [
    {
      id: "rl3",
      name: "Adv. Mahesh Jethmalani",
      exp: "Criminal Defense & Property Disputes",
      rating: "4.9 ⭐",
      cases: "380+ Cases",
      loc: "Mumbai High Court",
    }
  ],
  "Uttar Pradesh|Lucknow": [
    {
      id: "rl4",
      name: "Adv. Sudhanshu Kumar",
      exp: "Consumer Protection & Cyber Law",
      rating: "4.8 ⭐",
      cases: "120+ Cases",
      loc: "Lucknow High Court Bench",
      ph: "+91 99350 XXXXX"
    }
  ]
};
