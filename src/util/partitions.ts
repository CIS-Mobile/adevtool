export enum Partition {
  // System
  System = 'system',
  SystemDlkm = 'system_dlkm',
  SystemExt = 'system_ext',
  Product = 'product',
  Vendor = 'vendor',
  VendorDlkm = 'vendor_dlkm',
  Odm = 'odm',
  OdmDlkm = 'odm_dlkm',

  // Boot
  Boot = 'boot',
  Dt = 'dt',
  Dtbo = 'dtbo',
  InitBoot = 'init_boot',
  PvmFw = 'pvmfw',
  Recovery = 'recovery',
  Vbmeta = 'vbmeta',
  VbmetaSystem = 'vbmeta_system',
  VbmetaVendor = 'vbmeta_vendor',
  VendorBoot = 'vendor_boot',
  VendorKernelBoot = 'vendor_kernel_boot',
}

// Android system partitions, excluding "system"
export type ExtSysPartition = Partition.SystemExt | Partition.Product | Partition.Vendor | Partition.Odm
export const EXT_SYS_PARTITIONS = new Set(['system_ext', 'product', 'vendor', 'odm'])

// GKI DLKM partitions
export type DlkmPartition = Partition.SystemDlkm | Partition.VendorDlkm | Partition.OdmDlkm
export const DLKM_PARTITIONS = new Set(['system_dlkm', 'vendor_dlkm', 'odm_dlkm'])

export type ExtPartition = ExtSysPartition | DlkmPartition
export const EXT_PARTITIONS = new Set([...EXT_SYS_PARTITIONS, ...DLKM_PARTITIONS])

// All system partitions
export type SysPartition = Partition.System | ExtPartition
export const ALL_SYS_PARTITIONS = new Set(['system', ...EXT_PARTITIONS])
