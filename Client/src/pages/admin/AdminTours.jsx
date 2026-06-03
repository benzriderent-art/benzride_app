import { useState, useEffect, useRef } from 'react'
import { Plus, Pencil, Trash2, X, Loader2, Camera, Upload, Map } from 'lucide-react'
import { toast } from 'sonner'
import { tourApi } from '@/api/tours'
import { tourImageApi } from '@/api/tourImages'
import { formatIDR } from '@/utils/formatCurrency'
import { getTourImageUrls } from '@/utils/tourImages'

const CATEGORIES = ['CULTURAL', 'NATURE', 'SUNRISE', 'BEACH']
const CATEGORY_LABELS = {
  CULTURAL: 'Budaya',
  NATURE: 'Alam',
  SUNRISE: 'Sunrise',
  BEACH: 'Pantai',
}

const EMPTY_FORM = {
  name: '',
  description: '',
  category: 'CULTURAL',
  durationHours: '',
  pricePerPerson: '',
  maxParticipants: '',
  location: '',
  images: '',
  includes: '',
  highlights: '',
  itinerary: '',
  whatToBring: '',
  nameEn: '',
  descriptionEn: '',
  includesEn: '',
  highlightsEn: '',
  itineraryEn: '',
  whatToBringEn: '',
  guideLanguage: 'Indonesia & English',
  minBookingHours: 24,
  available: true,
  featured: false,
}

function parseLines(str) {
  return str.split('\n').map(s => s.trim()).filter(Boolean)
}

function joinLines(arr) {
  return Array.isArray(arr) ? arr.join('\n') : ''
}

export default function AdminTours() {
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editTour, setEditTour] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [deleteConfirmTour, setDeleteConfirmTour] = useState(null)
  const [imageTour, setImageTour] = useState(null)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [deletingImageId, setDeletingImageId] = useState(null)
  const fileInputRef = useRef(null)

  const load = () => {
    setLoading(true)
    tourApi.getAll().then(setTours).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditTour(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  const openEdit = (tour) => {
    setEditTour(tour)
    setForm({
      name: tour.name,
      description: tour.description,
      category: tour.category,
      durationHours: tour.durationHours,
      pricePerPerson: tour.pricePerPerson,
      maxParticipants: tour.maxParticipants,
      location: tour.location,
      images: joinLines(tour.images),
      includes: joinLines(tour.includes),
      highlights: joinLines(tour.highlights),
      itinerary: joinLines(tour.itinerary),
      whatToBring: joinLines(tour.whatToBring),
      nameEn: tour.nameEn || '',
      descriptionEn: tour.descriptionEn || '',
      includesEn: joinLines(tour.includesEn),
      highlightsEn: joinLines(tour.highlightsEn),
      itineraryEn: joinLines(tour.itineraryEn),
      whatToBringEn: joinLines(tour.whatToBringEn),
      guideLanguage: tour.guideLanguage || 'Indonesia & English',
      minBookingHours: tour.minBookingHours || 24,
      available: tour.available,
      featured: tour.featured || false,
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const payload = {
      name: form.name,
      description: form.description,
      category: form.category,
      durationHours: parseInt(form.durationHours),
      pricePerPerson: parseInt(form.pricePerPerson),
      maxParticipants: parseInt(form.maxParticipants),
      location: form.location,
      images: parseLines(form.images),
      includes: parseLines(form.includes),
      highlights: parseLines(form.highlights),
      itinerary: parseLines(form.itinerary),
      whatToBring: parseLines(form.whatToBring),
      nameEn: form.nameEn || null,
      descriptionEn: form.descriptionEn || null,
      includesEn: parseLines(form.includesEn),
      highlightsEn: parseLines(form.highlightsEn),
      itineraryEn: parseLines(form.itineraryEn),
      whatToBringEn: parseLines(form.whatToBringEn),
      guideLanguage: form.guideLanguage,
      minBookingHours: parseInt(form.minBookingHours) || 24,
      available: form.available,
      featured: form.featured,
    }
    try {
      if (editTour) {
        await tourApi.update(editTour.id, payload)
        toast.success('Tour berhasil diupdate.')
      } else {
        await tourApi.create(payload)
        toast.success('Tour berhasil ditambahkan.')
      }
      setShowModal(false)
      load()
    } catch {
      toast.error('Gagal menyimpan tour.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirmTour) return
    setDeleting(deleteConfirmTour.id)
    try {
      await tourApi.delete(deleteConfirmTour.id)
      toast.success('Tour dihapus.')
      setDeleteConfirmTour(null)
      load()
    } catch {
      toast.error('Gagal menghapus tour.')
    } finally {
      setDeleting(null)
    }
  }

  const handleUploadImages = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length || !imageTour) return
    setUploadingImages(true)
    try {
      await tourImageApi.upload(imageTour.id, files)
      const updated = await tourApi.getAll()
      setTours(updated)
      setImageTour(updated.find((t) => t.id === imageTour.id))
      toast.success(`${files.length} foto berhasil diupload`)
    } catch {
      toast.error('Gagal mengupload foto.')
    } finally {
      setUploadingImages(false)
      e.target.value = ''
    }
  }

  const handleDeleteImage = async (imageId) => {
    setDeletingImageId(imageId)
    try {
      await tourImageApi.delete(imageTour.id, imageId)
      const updated = await tourApi.getAll()
      setTours(updated)
      setImageTour(updated.find((t) => t.id === imageTour.id))
      toast.success('Foto berhasil dihapus')
    } catch {
      toast.error('Gagal menghapus foto.')
    } finally {
      setDeletingImageId(null)
    }
  }

  const inputCls = 'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gold transition-colors'

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-charcoal">Manajemen Tour</h1>
          <p className="text-sm text-gray-500 mt-0.5">{tours.length} tour terdaftar</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-charcoal text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-gold transition-colors"
        >
          <Plus size={16} />
          Tambah Tour
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={24} className="animate-spin text-gold" />
        </div>
      ) : tours.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 px-4 py-16 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center">
              <Map size={24} className="text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-400 mb-1">Belum ada tour terdaftar</p>
              <p className="text-xs text-gray-300">Tambahkan tour pertama untuk mulai menerima pesanan</p>
            </div>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-charcoal text-white px-4 py-2 rounded-lg hover:bg-gold transition-colors mt-1"
            >
              <Plus size={13} />
              Tambah Tour
            </button>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {tours.map(tour => (
            <div key={tour.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
              {tour.images?.[0] && (
                <img src={tour.images[0]} alt={tour.name} className="w-full h-40 object-cover" />
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-bold text-charcoal text-sm leading-tight">{tour.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    tour.available ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                  }`}>
                    {tour.available ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-1">{CATEGORY_LABELS[tour.category]} · {tour.durationHours} jam · {tour.location}</p>
                <p className="text-sm font-bold text-gold mb-3">{formatIDR(tour.pricePerPerson)} / orang</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setImageTour(tour)}
                    className="inline-flex items-center justify-center gap-1 text-xs font-semibold px-2.5 py-2 rounded-lg bg-gold/10 text-gold hover:bg-gold hover:text-white transition-colors"
                  >
                    <Camera size={12} />
                    {tour.tourImages?.length > 0 ? tour.tourImages.length : 0}
                  </button>
                  <button
                    onClick={() => openEdit(tour)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg py-2 hover:border-gold hover:text-gold transition-colors"
                  >
                    <Pencil size={12} /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirmTour(tour)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-red-500 border border-red-100 rounded-lg py-2 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={12} />
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {imageTour && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 overflow-y-auto py-8 px-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-charcoal">Foto Tour</h2>
                <p className="text-xs text-gray-400 mt-0.5">{imageTour.name}</p>
              </div>
              <button onClick={() => setImageTour(null)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Uploaded Images */}
              {imageTour.tourImages?.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {imageTour.tourImages.map((img) => (
                    <div key={img.id} className="relative group rounded-lg overflow-hidden aspect-square">
                      <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleDeleteImage(img.id)}
                        disabled={deletingImageId === img.id}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        {deletingImageId === img.id
                          ? <Loader2 size={18} className="text-white animate-spin" />
                          : <Trash2 size={18} className="text-white" />}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-xl">
                  Belum ada foto yang diupload
                </div>
              )}

              {/* Seeder/URL images info */}
              {imageTour.images?.length > 0 && imageTour.tourImages?.length === 0 && (
                <p className="text-xs text-gray-400 text-center">
                  Saat ini menggunakan {imageTour.images.length} foto default. Upload foto baru untuk menggantikannya.
                </p>
              )}

              {/* Upload button */}
              <div>
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
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gold/40 text-gold text-sm font-semibold hover:bg-gold/5 transition-colors disabled:opacity-50"
                >
                  {uploadingImages
                    ? <><Loader2 size={16} className="animate-spin" /> Mengupload...</>
                    : <><Upload size={16} /> Upload Foto Baru (bisa multifile)</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirmTour && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-xl p-6 text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-red-400" />
            </div>
            <h3 className="font-bold text-charcoal mb-1">Hapus Tour?</h3>
            <p className="text-sm text-gray-500 mb-1 font-medium">&ldquo;{deleteConfirmTour.name}&rdquo;</p>
            <p className="text-xs text-gray-400 mb-6">Data tour akan dihapus secara permanen dan tidak bisa dikembalikan.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmTour(null)}
                disabled={deleting === deleteConfirmTour.id}
                className="flex-1 text-sm font-medium text-gray-600 border border-gray-200 py-2 rounded hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting === deleteConfirmTour.id}
                className="flex-1 text-sm font-semibold bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5"
              >
                {deleting === deleteConfirmTour.id && <Loader2 size={13} className="animate-spin" />}
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tour Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 overflow-y-auto py-8 px-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-charcoal">{editTour ? 'Edit Tour' : 'Tambah Tour'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Nama Tour *</label>
                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="Nama tour" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Deskripsi *</label>
                <textarea required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className={`${inputCls} resize-none`} placeholder="Deskripsi tour" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Kategori</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inputCls}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Durasi (jam) *</label>
                  <input required type="number" min="1" value={form.durationHours} onChange={e => setForm(f => ({ ...f, durationHours: e.target.value }))} className={inputCls} placeholder="8" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Harga / Orang (Rp) *</label>
                  <input required type="number" min="0" value={form.pricePerPerson} onChange={e => setForm(f => ({ ...f, pricePerPerson: e.target.value }))} className={inputCls} placeholder="450000" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Maks Peserta *</label>
                  <input required type="number" min="1" value={form.maxParticipants} onChange={e => setForm(f => ({ ...f, maxParticipants: e.target.value }))} className={inputCls} placeholder="8" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Lokasi *</label>
                <input required value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className={inputCls} placeholder="Ubud, Bali" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">URL Gambar (satu per baris)</label>
                <textarea value={form.images} onChange={e => setForm(f => ({ ...f, images: e.target.value }))} rows={2} className={`${inputCls} resize-none`} placeholder="https://..." />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Yang Termasuk (satu per baris)</label>
                <textarea value={form.includes} onChange={e => setForm(f => ({ ...f, includes: e.target.value }))} rows={3} className={`${inputCls} resize-none`} placeholder="Guide profesional&#10;Motor & bensin" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Highlights (satu per baris)</label>
                <textarea value={form.highlights} onChange={e => setForm(f => ({ ...f, highlights: e.target.value }))} rows={3} className={`${inputCls} resize-none`} placeholder="Sawah Tegalalang&#10;Pura Tirta Empul" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Itinerary (satu per baris, format: 08:00 | Aktivitas)</label>
                <textarea value={form.itinerary} onChange={e => setForm(f => ({ ...f, itinerary: e.target.value }))} rows={4} className={`${inputCls} resize-none`} placeholder="08:00 | Pick-up di hotel&#10;09:00 | Sawah Tegalalang" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Yang Perlu Dibawa (satu per baris)</label>
                <textarea value={form.whatToBring} onChange={e => setForm(f => ({ ...f, whatToBring: e.target.value }))} rows={3} className={`${inputCls} resize-none`} placeholder="Sunscreen&#10;Kamera / HP" />
              </div>

              {/* ── English Content ── */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-black text-gold tracking-[0.15em] uppercase mb-3">🌐 English Content</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Tour Name (EN)</label>
                    <input value={form.nameEn} onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))} className={inputCls} placeholder="Tour name in English" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Description (EN)</label>
                    <textarea value={form.descriptionEn} onChange={e => setForm(f => ({ ...f, descriptionEn: e.target.value }))} rows={3} className={`${inputCls} resize-none`} placeholder="Tour description in English" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">What's Included (EN, one per line)</label>
                    <textarea value={form.includesEn} onChange={e => setForm(f => ({ ...f, includesEn: e.target.value }))} rows={3} className={`${inputCls} resize-none`} placeholder="Professional local guide&#10;Motorcycle & fuel" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Highlights (EN, one per line)</label>
                    <textarea value={form.highlightsEn} onChange={e => setForm(f => ({ ...f, highlightsEn: e.target.value }))} rows={3} className={`${inputCls} resize-none`} placeholder="Tegalalang Rice Terrace&#10;Sacred Monkey Forest" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Itinerary (EN, format: 08:00 | Activity)</label>
                    <textarea value={form.itineraryEn} onChange={e => setForm(f => ({ ...f, itineraryEn: e.target.value }))} rows={4} className={`${inputCls} resize-none`} placeholder="08:00 | Hotel pick-up&#10;09:00 | Tegalalang Rice Terrace" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">What to Bring (EN, one per line)</label>
                    <textarea value={form.whatToBringEn} onChange={e => setForm(f => ({ ...f, whatToBringEn: e.target.value }))} rows={3} className={`${inputCls} resize-none`} placeholder="Sunscreen&#10;Camera / smartphone" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Bahasa Guide</label>
                  <input value={form.guideLanguage} onChange={e => setForm(f => ({ ...f, guideLanguage: e.target.value }))} className={inputCls} placeholder="Indonesia & English" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Min. Booking (jam)</label>
                  <input type="number" min="1" value={form.minBookingHours} onChange={e => setForm(f => ({ ...f, minBookingHours: e.target.value }))} className={inputCls} placeholder="24" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="available" checked={form.available} onChange={e => setForm(f => ({ ...f, available: e.target.checked }))} className="accent-gold" />
                  <label htmlFor="available" className="text-sm text-gray-600">Tour tersedia / aktif</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="accent-gold" />
                  <label htmlFor="featured" className="text-sm text-gray-600">🔥 Terpopuler / Best Seller</label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 rounded-lg bg-charcoal text-white text-sm font-semibold hover:bg-gold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  {editTour ? 'Simpan Perubahan' : 'Tambah Tour'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
