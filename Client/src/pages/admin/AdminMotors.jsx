import { useState, useEffect, useRef } from 'react'
import { Plus, Pencil, Trash2, X, Camera, Upload, Bike } from 'lucide-react'
import { toast } from 'sonner'
import { motorApi } from '@/api/motors'
import { motorImageApi } from '@/api/motorImages'
import { formatIDR } from '@/utils/formatCurrency'

const STATUSES = [
  { value: 'AVAILABLE',   label: 'Tersedia',        color: 'bg-green-50 text-green-600' },
  { value: 'RENTED',      label: 'Sedang Disewa',   color: 'bg-blue-50 text-blue-600' },
  { value: 'MAINTENANCE', label: 'Maintenance',      color: 'bg-amber-50 text-amber-600' },
]

const statusFromMotor = (m) => {
  if (!m.available) return m.status ?? 'RENTED'
  return 'AVAILABLE'
}

const EMPTY_FORM = {
  name: '',
  cc: '',
  transmission: 'automatic',
  year: new Date().getFullYear(),
  priceDay: '',
  priceWeek: '',
  priceMonth: '',
  available: true,
  status: 'AVAILABLE',
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

  const [imageMotor, setImageMotor] = useState(null)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [deletingImageId, setDeletingImageId] = useState(null)
  const fileInputRef = useRef(null)
  const originalFormRef = useRef(null)

  const fetchMotors = () =>
    motorApi.getAll()
      .then((data) => setMotors(data.map((m) => ({ ...m, transmission: m.transmission?.toLowerCase() }))))
      .finally(() => setLoading(false))

  useEffect(() => { fetchMotors() }, [])

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setErrors({})
    originalFormRef.current = { ...EMPTY_FORM }
    setModal(true)
  }

  const openEdit = (motor) => {
    setEditing(motor.id)
    const initial = { ...motor, status: statusFromMotor(motor) }
    setForm(initial)
    setErrors({})
    originalFormRef.current = { ...initial }
    setModal(true)
  }

  const isFormDirty = () => {
    if (!originalFormRef.current) return false
    return Object.keys(EMPTY_FORM).some(
      k => String(form[k] ?? '') !== String(originalFormRef.current[k] ?? '')
    )
  }

  const closeModal = (force = false) => {
    if (!force && isFormDirty()) {
      if (!window.confirm('Ada perubahan yang belum disimpan. Yakin ingin menutup?')) return
    }
    setModal(false)
    setEditing(null)
    setErrors({})
    originalFormRef.current = null
  }

  const validate = (f = form) => {
    const errs = {}
    if (!f.name.trim()) errs.name = 'Wajib diisi'
    if (!f.cc || f.cc <= 0) errs.cc = 'Wajib diisi'
    if (!f.year || f.year < 2010) errs.year = 'Tahun tidak valid'
    if (!f.priceDay || f.priceDay <= 0) errs.priceDay = 'Wajib diisi'
    if (!f.priceWeek || f.priceWeek <= 0) errs.priceWeek = 'Wajib diisi'
    if (!f.priceMonth || f.priceMonth <= 0) errs.priceMonth = 'Wajib diisi'
    return errs
  }

  const handleFieldChange = (field, value) => {
    const updated = { ...form, [field]: value }
    setForm(updated)
    if (Object.keys(errors).length > 0) setErrors(validate(updated))
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
      available: form.status === 'AVAILABLE',
    }

    setSaving(true)
    try {
      if (editing) {
        await motorApi.update(editing, data)
        toast.success('Motor berhasil diperbarui')
      } else {
        await motorApi.create(data)
        toast.success('Motor berhasil ditambahkan')
      }
      closeModal()
      fetchMotors()
    } catch {
      toast.error('Gagal menyimpan data motor. Coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await motorApi.delete(deleteId)
      setDeleteId(null)
      fetchMotors()
      toast.success('Motor berhasil dihapus')
    } catch {
      toast.error('Gagal menghapus motor. Coba lagi.')
    }
  }

  const openImageModal = (motor) => {
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
      toast.success(`${files.length} foto berhasil diupload`)
    } catch {
      toast.error('Gagal mengupload gambar. Coba lagi.')
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
      toast.success('Foto berhasil dihapus')
    } catch {
      toast.error('Gagal menghapus gambar. Coba lagi.')
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
                <th className="hidden sm:table-cell text-left px-4 py-3 text-xs font-semibold text-gray-400 whitespace-nowrap">No</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 whitespace-nowrap">Nama Motor</th>
                <th className="hidden sm:table-cell text-left px-4 py-3 text-xs font-semibold text-gray-400 whitespace-nowrap">CC</th>
                <th className="hidden sm:table-cell text-left px-4 py-3 text-xs font-semibold text-gray-400 whitespace-nowrap">Transmisi</th>
                <th className="hidden sm:table-cell text-left px-4 py-3 text-xs font-semibold text-gray-400 whitespace-nowrap">Tahun</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 whitespace-nowrap">Harga/Hari</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 whitespace-nowrap">Foto</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 whitespace-nowrap">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {['w-5', 'w-32', 'w-12', 'w-16', 'w-12', 'w-24', 'w-10', 'w-20', 'w-16'].map((w, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <div className={`h-3.5 ${w} bg-gray-100 animate-pulse rounded`} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : motors.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-14 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center">
                        <Bike size={24} className="text-gray-300" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-400 mb-1">Belum ada motor terdaftar</p>
                        <p className="text-xs text-gray-300">Tambahkan motor pertama untuk mulai menerima booking</p>
                      </div>
                      <button
                        onClick={openAdd}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold bg-charcoal text-white px-4 py-2 rounded-lg hover:bg-gold transition-colors mt-1"
                      >
                        <Plus size={13} />
                        Tambah Motor
                      </button>
                    </div>
                  </td>
                </tr>
              ) : motors.map((motor, idx) => (
                <tr key={motor.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="hidden sm:table-cell px-4 py-3 text-gray-400 text-xs">{idx + 1}</td>
                  <td className="px-4 py-3 font-semibold text-charcoal whitespace-nowrap">{motor.name}</td>
                  <td className="hidden sm:table-cell px-4 py-3 text-gray-600">{motor.cc}</td>
                  <td className="hidden sm:table-cell px-4 py-3 text-gray-600 capitalize">
                    {motor.transmission === 'automatic' ? 'Matik' : 'Manual'}
                  </td>
                  <td className="hidden sm:table-cell px-4 py-3 text-gray-600">{motor.year}</td>
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
                    {(() => {
                      const s = STATUSES.find(s => s.value === statusFromMotor(motor)) ?? STATUSES[0]
                      return (
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.color}`}>
                          {s.label}
                        </span>
                      )
                    })()}
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

            <div className="px-6 py-5 space-y-4 light-form">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">Nama Motor *</label>
                <input type="text" value={form.name} onChange={(e) => handleFieldChange('name', e.target.value)} className={fieldClass('name')} placeholder="Honda PCX 160" />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1.5">CC *</label>
                  <input type="number" value={form.cc} onChange={(e) => handleFieldChange('cc', e.target.value)} className={fieldClass('cc')} placeholder="160" min={50} max={1000} />
                  {errors.cc && <p className="text-xs text-red-400 mt-1">{errors.cc}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1.5">Tahun *</label>
                  <input type="number" value={form.year} onChange={(e) => handleFieldChange('year', e.target.value)} className={fieldClass('year')} min={2010} max={2030} />
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
                    <input type="number" value={form[key]} onChange={(e) => handleFieldChange(key, e.target.value)} className={fieldClass(key)} placeholder="0" min={0} />
                    {errors[key] && <p className="text-xs text-red-400 mt-1">{errors[key]}</p>}
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">Status Motor *</label>
                <div className="grid grid-cols-3 gap-2">
                  {STATUSES.map(({ value, label, color }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm({ ...form, status: value, available: value === 'AVAILABLE' })}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border-2 transition-all ${
                        form.status === value
                          ? `${color} border-current`
                          : 'border-gray-200 text-gray-400 hover:border-gray-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

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
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 text-sm font-medium text-gray-600 border border-gray-200 py-2 rounded hover:bg-gray-50 transition-colors">Batal</button>
              <button onClick={handleDelete} className="flex-1 text-sm font-semibold bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
