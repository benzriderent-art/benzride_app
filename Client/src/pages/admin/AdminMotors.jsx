import { useState, useEffect, useRef } from 'react'
import { Plus, Pencil, Trash2, X, Camera, Upload } from 'lucide-react'
import { motorApi } from '@/api/motors'
import { motorImageApi } from '@/api/motorImages'
import { formatIDR } from '@/utils/formatCurrency'

const EMPTY_FORM = {
  name: '',
  cc: '',
  transmission: 'automatic',
  year: new Date().getFullYear(),
  priceDay: '',
  priceWeek: '',
  priceMonth: '',
  available: true,
}

export default function AdminMotors() {
  const [motors, setMotors] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [deleteId, setDeleteId] = useState(null)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [imageError, setImageError] = useState('')

  const [imageMotor, setImageMotor] = useState(null)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [deletingImageId, setDeletingImageId] = useState(null)
  const fileInputRef = useRef(null)

  const fetchMotors = () =>
    motorApi.getAll()
      .then((data) => setMotors(data.map((m) => ({ ...m, transmission: m.transmission?.toLowerCase() }))))
      .finally(() => setLoading(false))

  useEffect(() => { fetchMotors() }, [])

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setModal(true)
  }

  const openEdit = (motor) => {
    setEditing(motor.id)
    setForm({ ...motor })
    setErrors({})
    setModal(true)
  }

  const closeModal = () => {
    setModal(false)
    setEditing(null)
    setErrors({})
    setSaveError('')
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Wajib diisi'
    if (!form.cc || form.cc <= 0) errs.cc = 'Wajib diisi'
    if (!form.year || form.year < 2010) errs.year = 'Tahun tidak valid'
    if (!form.priceDay || form.priceDay <= 0) errs.priceDay = 'Wajib diisi'
    if (!form.priceWeek || form.priceWeek <= 0) errs.priceWeek = 'Wajib diisi'
    if (!form.priceMonth || form.priceMonth <= 0) errs.priceMonth = 'Wajib diisi'
    return errs
  }

  const handleSave = async () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    const data = {
      ...form,
      cc: parseInt(form.cc),
      year: parseInt(form.year),
      priceDay: parseInt(form.priceDay),
      priceWeek: parseInt(form.priceWeek),
      priceMonth: parseInt(form.priceMonth),
    }

    setSaving(true)
    try {
      if (editing) {
        await motorApi.update(editing, data)
      } else {
        await motorApi.create(data)
      }
      closeModal()
      fetchMotors()
    } catch {
      setSaveError('Gagal menyimpan data motor. Coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await motorApi.delete(deleteId)
      setDeleteId(null)
      fetchMotors()
    } catch {
      setDeleteError('Gagal menghapus motor. Coba lagi.')
    }
  }

  const openImageModal = (motor) => {
    setImageError('')
    setImageMotor(motors.find((m) => m.id === motor.id))
  }

  const handleUploadImages = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length || !imageMotor) return
    setUploadingImages(true)
    try {
      await motorImageApi.upload(imageMotor.id, files)
      const updated = await motorApi.getAll()
      const normalized = updated.map((m) => ({ ...m, transmission: m.transmission?.toLowerCase() }))
      setMotors(normalized)
      setImageMotor(normalized.find((m) => m.id === imageMotor.id))
    } catch {
      setImageError('Gagal mengupload gambar. Coba lagi.')
    } finally {
      setUploadingImages(false)
      e.target.value = ''
    }
  }

  const handleDeleteImage = async (imageId) => {
    setDeletingImageId(imageId)
    try {
      await motorImageApi.delete(imageMotor.id, imageId)
      const updated = await motorApi.getAll()
      const normalized = updated.map((m) => ({ ...m, transmission: m.transmission?.toLowerCase() }))
      setMotors(normalized)
      setImageMotor(normalized.find((m) => m.id === imageMotor.id))
    } catch {
      setImageError('Gagal menghapus gambar. Coba lagi.')
    } finally {
      setDeletingImageId(null)
    }
  }

  const fieldClass = (key) =>
    `w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors ${
      errors[key] ? 'border-red-400' : 'border-gray-200'
    }`

  return (
    <div className="p-7">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-bold text-charcoal">Manajemen Motor</h1>
          <p className="text-sm text-gray-400 mt-0.5">{motors.length} motor terdaftar</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-charcoal text-white text-sm font-semibold px-4 py-2.5 rounded hover:bg-gold transition-colors"
        >
          <Plus size={16} />
          Tambah Motor
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                {['No', 'Nama Motor', 'CC', 'Transmisi', 'Tahun', 'Harga/Hari', 'Foto', 'Status', 'Aksi'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-400">Memuat data...</td>
                </tr>
              ) : motors.map((motor, idx) => (
                <tr key={motor.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-gray-400 text-xs">{idx + 1}</td>
                  <td className="px-4 py-3 font-semibold text-charcoal whitespace-nowrap">{motor.name}</td>
                  <td className="px-4 py-3 text-gray-600">{motor.cc}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize">
                    {motor.transmission === 'automatic' ? 'Matik' : 'Manual'}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{motor.year}</td>
                  <td className="px-4 py-3 font-semibold text-charcoal whitespace-nowrap">
                    {formatIDR(motor.priceDay)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openImageModal(motor)}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-gold/10 text-gold hover:bg-gold hover:text-white transition-colors"
                    >
                      <Camera size={12} />
                      {motor.images?.length ?? 0}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        motor.available ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {motor.available ? 'Tersedia' : 'Tidak Tersedia'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(motor)} className="p-1.5 text-gray-400 hover:text-gold transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteId(motor.id)} className="p-1.5 text-gray-400 hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-charcoal">{editing ? 'Edit Motor' : 'Tambah Motor'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-charcoal transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">Nama Motor *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={fieldClass('name')} placeholder="Honda PCX 160" />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1.5">CC *</label>
                  <input type="number" value={form.cc} onChange={(e) => setForm({ ...form, cc: e.target.value })} className={fieldClass('cc')} placeholder="160" min={50} max={1000} />
                  {errors.cc && <p className="text-xs text-red-400 mt-1">{errors.cc}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1.5">Tahun *</label>
                  <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className={fieldClass('year')} min={2010} max={2030} />
                  {errors.year && <p className="text-xs text-red-400 mt-1">{errors.year}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">Transmisi *</label>
                <select value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold">
                  <option value="automatic">Matik (Automatic)</option>
                  <option value="manual">Manual</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[{ key: 'priceDay', label: 'Harga/Hari *' }, { key: 'priceWeek', label: 'Harga/Minggu *' }, { key: 'priceMonth', label: 'Harga/Bulan *' }].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-charcoal mb-1.5">{label}</label>
                    <input type="number" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className={fieldClass(key)} placeholder="0" min={0} />
                    {errors[key] && <p className="text-xs text-red-400 mt-1">{errors[key]}</p>}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2.5">
                <input type="checkbox" id="available" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} className="accent-gold w-4 h-4" />
                <label htmlFor="available" className="text-sm font-medium text-charcoal">Motor tersedia untuk disewa</label>
              </div>
            </div>

            {saveError && (
              <div className="px-6 pb-0 pt-0">
                <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded px-3 py-2">{saveError}</p>
              </div>
            )}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={closeModal} className="text-sm font-medium text-gray-500 px-4 py-2 rounded hover:bg-gray-100 transition-colors">Batal</button>
              <button onClick={handleSave} disabled={saving} className="text-sm font-semibold bg-charcoal text-white px-5 py-2 rounded hover:bg-gold transition-colors disabled:opacity-60">
                {saving ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Tambah Motor'}
              </button>
            </div>
          </div>
        </div>
      )}

      {imageMotor && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
          onClick={(e) => e.target === e.currentTarget && setImageMotor(null)}
        >
          <div className="bg-white rounded-xl w-full max-w-xl shadow-xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-charcoal">Foto Motor</h3>
                <p className="text-xs text-gray-400 mt-0.5">{imageMotor.name}</p>
              </div>
              <button onClick={() => setImageMotor(null)} className="text-gray-400 hover:text-charcoal transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              {imageMotor.images?.length > 0 ? (
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {imageMotor.images.map((img) => (
                    <div key={img.id} className="relative group rounded-lg overflow-hidden aspect-square border border-gray-100">
                      <img src={img.imageUrl} alt="Motor" className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleDeleteImage(img.id)}
                        disabled={deletingImageId === img.id}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        {deletingImageId === img.id ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 size={18} className="text-white" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-6">Belum ada foto. Upload foto motor di bawah.</p>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleUploadImages}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImages}
                className="w-full inline-flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 text-gray-400 hover:border-gold hover:text-gold text-sm font-semibold py-4 rounded-lg transition-colors disabled:opacity-60"
              >
                {uploadingImages ? (
                  <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Upload size={16} />
                )}
                {uploadingImages ? 'Mengupload...' : 'Pilih Foto (bisa lebih dari satu)'}
              </button>
              {imageError && (
                <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded px-3 py-2 mt-2">{imageError}</p>
              )}
              <p className="text-xs text-gray-400 text-center mt-2">JPG, PNG, WEBP. Hover foto untuk menghapus.</p>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-xl p-6 text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-red-400" />
            </div>
            <h3 className="font-bold text-charcoal mb-2">Hapus Motor?</h3>
            <p className="text-sm text-gray-500 mb-6">Data motor ini akan dihapus secara permanen dan tidak bisa dikembalikan.</p>
            {deleteError && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded px-3 py-2 mb-4">{deleteError}</p>
            )}
            <div className="flex gap-3">
              <button onClick={() => { setDeleteId(null); setDeleteError('') }} className="flex-1 text-sm font-medium text-gray-600 border border-gray-200 py-2 rounded hover:bg-gray-50 transition-colors">Batal</button>
              <button onClick={handleDelete} className="flex-1 text-sm font-semibold bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
