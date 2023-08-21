import { promises as fs } from 'fs'
import path from 'path'

import { BlobEntry } from './entry'
import { startActionSpinner, stopActionSpinner } from '../util/cli'
import { readFile } from '../util/fs'

export async function copyBlobs(entries: Iterable<BlobEntry>, srcDir: string, destDir: string) {
  let spinner = startActionSpinner('Copying files')

  for (let entry of entries) {
    let outPath = `${destDir}/${entry.srcPath}`
    let srcPath = entry.diskSrcPath ?? `${srcDir}/${entry.srcPath}`
    spinner.text = entry.srcPath

    // Symlinks are created at build time, not copied
    let stat = await fs.lstat(srcPath)
    if (stat.isSymbolicLink()) {
      continue
    }

    // Create directory structure
    await fs.mkdir(path.dirname(outPath), { recursive: true })

    // Some files need patching
    if (entry.path.endsWith('.xml')) {
      let xml = await readFile(srcPath)
      if (xml.startsWith('/*')) {
        // Fix Qualcomm XMLs that start with C style comments.
        let patched = xml.replace(/\/\*[\s\S]*?\*\//, '');
        await fs.writeFile(srcPath, patched);
        continue
      }
      // Fix Qualcomm "version 2.0" XMLs
      if (xml.startsWith('<?xml version="2.0"')) {
        let patched = xml.replace(/^<\?xml version="2.0"/, '<?xml version="1.0"')
        await fs.writeFile(outPath, patched)
        continue
      }
      // Fix Qualcomm "XML declaration allowed only at the start of the document" XMLs
      if (!xml.startsWith('<?xml version="1.0"')) {
        let patched = xml.replace('<?xml version="1.0" encoding="UTF-8"?>', '');
        await fs.writeFile(outPath, patched)
        continue
      }
    }

    await fs.copyFile(srcPath, outPath)
  }

  stopActionSpinner(spinner)
}
