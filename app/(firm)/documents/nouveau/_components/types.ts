export type {
  FileKind, LoadedFile,
} from '@/lib/upload-types'

export {
  getFileKind, FILE_KIND_META,
  MONTHS, DOC_COLORS,
  qualKey, getDocs, getAllDocs,
} from '@/lib/upload-types'

export type CabSource = 'customer' | 'firm'

export type CabQualification = {
  typeId:     string
  typeName:   string
  year:       string
  month:      string
  note:       string
  committed?: boolean
}

export type Customer = { id: string; name: string; country_code: string }
export type DocType  = { id: string; name: string }

export type CabWizardContext = {
  firmName:    string
  customers:   Customer[]
  accessToken: string
}
