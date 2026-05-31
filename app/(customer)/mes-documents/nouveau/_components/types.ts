export type {
  FileKind, LoadedFile,
} from '@/lib/upload-types'

export {
  getFileKind, FILE_KIND_META,
  MONTHS, DOC_COLORS,
  qualKey, getDocs, getAllDocs,
} from '@/lib/upload-types'

export type Qualification = {
  type: string
  year: string
  month: string
  note: string
  committed?: boolean
}

export type WizardContext = {
  customerId:        string
  customerName:      string
  cabinetName:       string
  existingFilenames: string[]
  accessToken:       string
}

export const CUSTOMER_DOC_TYPES: { value: string; label: string }[] = [
  { value: 'Facture vente',       label: 'Facture vente' },
  { value: 'Facture achat',       label: 'Facture achat' },
  { value: 'Relevé bancaire',     label: 'Relevé bancaire' },
  { value: 'Note de frais',       label: 'Note de frais' },
  { value: 'Absence / congé',     label: 'Absence / congé' },
  { value: "Contrat d'embauche",  label: "Contrat d'embauche" },
  { value: 'Contrat fournisseur', label: 'Contrat fournisseur' },
  { value: 'Contrat vente',       label: 'Contrat vente' },
  { value: 'Autre contrat',       label: 'Autre contrat' },
  { value: 'Autre',               label: 'Autre' },
]
