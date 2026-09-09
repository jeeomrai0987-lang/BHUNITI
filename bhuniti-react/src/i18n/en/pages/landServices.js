/*
 * English strings for src/pages/citizen/LandServices.jsx -- step one of the
 * mutation wizard: the four service cards and the required-documents panel
 * beside them.
 *
 * Each service owns its title, its one-line description and its document list,
 * so the sidebar is rendered from the same entry as the card rather than from a
 * second hand-kept copy (the original listed three services in the sidebar and
 * four in the grid). The document lists are named maps rather than arrays,
 * because t() resolves strings only; the page's fixture names which keys to
 * show. The step counter, the file-size cap and the citizen id all arrive as
 * {{placeholders}}.
 *
 * Reached from a component as t("pages.landServices....").
 */

const landServices = {
  step: "Step {{current}} of {{total}}",
  title: "Initiate Mutation Service",
  intro:
    "Select the type of mutation request you wish to file. This determines the documents you need and the review your application goes through.",

  services: {
    sale: {
      title: "Sale / Transfer",
      description: "When you have bought or sold land. Requires a registered sale deed.",
      badge: "Common",
      docs: {
        deed: "Registered sale deed",
        tax: "Latest tax receipt",
        identity: "Identity proof (Aadhaar or PAN)",
        photo: "Passport-size photograph",
      },
    },
    inheritance: {
      title: "Inheritance",
      description: "For updating the record after a succession. A death certificate is required.",
      docs: {
        death: "Death certificate of the recorded owner",
        heir: "Legal heir certificate",
        affidavit: "Affidavit from the heirs",
      },
    },
    giftPartition: {
      title: "Gift / Partition",
      description:
        "For voluntary transfers or a division within the family. A registered deed is needed.",
      docs: {
        deed: "Registered gift or partition deed",
        consent: "Consent of all co-owners",
        identity: "Identity proof of every party",
      },
    },
    correction: {
      title: "Correction request",
      description:
        "To report a discrepancy in your current record — a misspelt name or a wrong area.",
      badge: "No fee",
      docs: {
        records: "Older records showing the correct entry",
        order: "Court order, where one applies",
        application: "Application setting out the discrepancy",
      },
    },
  },

  // The card is the control, so the accessible name says what picking it does.
  selectService: "Select {{title}}",
  selectedService: "Selected",

  profile: {
    citizenId: "Citizen ID: {{id}}",
    kycVerified: "KYC verified",
  },

  documents: {
    heading: "Required documents",
    forService: "For {{title}}",
    intro: "Prepare scanned copies (PDF or JPG) before you start. Maximum {{size}} per file.",
    // {{link}} is filled with the anchor itself, so Hindi is free to move it.
    help: "Need help gathering documents? Visit the {{link}} or call the toll-free number.",
    helpCentre: "Help Centre",
  },
};

export default landServices;
