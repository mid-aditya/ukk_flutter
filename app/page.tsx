"use client";
import Image from "next/image";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Agenda {
  id: number;
  judul: string;
  tanggal: string;
  waktu: string;
  lokasi: string;
  deskripsi: string;
  post?: {
    galery?: {
      foto?: {
        file: string;
      }[];
    }[];
  };
}

interface Informasi {
  id: number;
  judul: string;
  isi: string;
  tanggal: string;
  keterangan: string;
  post?: {
    galery?: {
      foto?: {
        file: string;
      }[];
    }[];
  };
}

interface Foto {
  id: number;
  file: string;
  judul: string;
  galery: {
    post: {
      kategori: {
        judul: string;
      }
    }
  }
}

export default function Home() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [informasis, setInformasis] = useState<Informasi[]>([]);
  const [fotos, setFotos] = useState<Foto[]>([]);

  useEffect(() => {
    fetchAgendaAndInformasi();
    fetchFotos();
  }, []);

  const fetchAgendaAndInformasi = async () => {
    try {
      // Fetch Agenda
      const { data: agendaData, error: agendaError } = await supabase
        .from('agenda')
        .select(`
          *,
          post:post_id (
            galery (
              foto (
                file
              )
            )
          )
        `)
        .eq('status', 'aktif')
        .order('tanggal', { ascending: true })
        .limit(3);

      if (agendaError) throw agendaError;
      setAgendas(agendaData || []);

      // Fetch Informasi
      const { data: informasiData, error: informasiError } = await supabase
        .from('informasi')
        .select(`
          *,
          post:post_id (
            galery (
              foto (
                file
              )
            )
          )
        `)
        .eq('status', 'aktif')
        .order('tanggal', { ascending: false })
        .limit(3);

      if (informasiError) throw informasiError;
      setInformasis(informasiData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchFotos = async () => {
    try {
      const { data, error } = await supabase
        .from('foto')
        .select(`
          id,
          file,
          judul,
          galery:galery_id (
            post:post_id (
              kategori:kategori_id (
                judul
              )
            )
          )
        `)
        .eq('galery.status', 1)
        .limit(4);

      if (error) {
        console.error('Supabase error:', error.message);
        return;
      }

      // Transform data dengan type safety
      const transformedData: Foto[] = (data || []).map(item => ({
        id: item.id,
        file: item.file,
        judul: item.judul,
        galery: {
          post: {
            kategori: {
              judul: item.galery?.post?.kategori?.judul || ''
            }
          }
        }
      }));

      setFotos(transformedData);
      
    } catch (err: any) {
      console.error('Error fetching photos:', err.message);
    }
  };

  const jurusans = [
    {
      id: 1,
      nama: "Pengembangan Perangkat Lunak dan Gim",
      singkatan: "PPLG",
      image: "/pplg.png",
      deskripsi: "Program keahlian yang fokus pada pengembangan aplikasi, web, mobile, dan game. Siswa akan mempelajari berbagai bahasa pemrograman dan teknologi terkini.",
      kompetensi: [
        "Pemrograman Web Frontend & Backend",
        "Mobile App Development",
        "Game Development",
        "Database Management",
        "UI/UX Design"
      ],
      warna: "from-blue-500/20 to-cyan-500/20"
    },
    {
      id: 2,
      nama: "Teknik Jaringan Komputer dan Telekomunikasi",
      singkatan: "TJKT",
      image: "/tjkt.png",
      deskripsi: "Program keahlian yang mempelajari tentang jaringan komputer, administrasi server, dan sistem telekomunikasi modern.",
      kompetensi: [
        "Instalasi dan Konfigurasi Jaringan",
        "Administrasi Server",
        "Keamanan Jaringan",
        "Cloud Computing",
        "Sistem Telekomunikasi"
      ],
      warna: "from-purple-500/20 to-pink-500/20"
    },
    {
      id: 3,
      nama: "Teknik Otomotif",
      singkatan: "TO",
      image: "/to.png",
      deskripsi: "Program keahlian yang mempelajari tentang perawatan dan perbaikan kendaraan bermotor dengan teknologi terkini.",
      kompetensi: [
        "Perawatan Mesin Kendaraan",
        "Sistem Kelistrikan Otomotif",
        "Teknologi Motor Listrik",
        "Diagnosa Kerusakan",
        "Sistem Kontrol Elektronik"
      ],
      warna: "from-orange-500/20 to-red-500/20"
    },
    {
      id: 4,
      nama: "Teknik Pengelasan",
      singkatan: "TP",
      image: "/tp.jpeg",
      deskripsi: "Program keahlian yang mempelajari berbagai teknik pengelasan modern dan fabrikasi logam sesuai standar industri.",
      kompetensi: [
        "Las SMAW",
        "Las MIG/MAG",
        "Las TIG",
        "Fabrikasi Logam",
        "Keselamatan Kerja"
      ],
      warna: "from-red-500/20 to-yellow-500/20"
    }
  ];

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] bg-white">
      <Navbar />
      
      {/* Hero Section Full Screen */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <Image
          className="object-cover brightness-[0.9] scale-105 animate-slow-zoom"
          src="/r-tkj.jpg"
          alt="SMKN 4 Bogor"
          fill
          priority
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50 flex items-center justify-center"
        >
          <div className="text-center text-white max-w-4xl px-4">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
            >
              SMK Negeri 4 Bogor
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl mb-8 text-gray-200"
            >
              Unggul dalam Prestasi, Berkarakter, dan Berwawasan Lingkungan
            </motion.p>
            <motion.a 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              href="#explore"
              className="inline-block border border-white/30 hover:bg-white hover:text-black transition-all duration-300 rounded-full px-8 py-3 text-lg backdrop-blur-sm"
            >
              Jelajahi
            </motion.a>
          </div>
        </motion.div>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* Sambutan Kepala Sekolah */}
      <section id="explore" className="py-24 px-4 md:px-8 bg-white">
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center"
        >
          <motion.div 
            variants={fadeIn}
            className="w-full md:w-1/3"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl">
              <Image
                className="object-cover hover:scale-105 transition-transform duration-700"
                src="/kepala-sekolah.jpg"
                alt="Kepala SMKN 4 Bogor"
                fill
              />
            </div>
          </motion.div>
          <motion.div 
            variants={fadeIn}
            className="w-full md:w-2/3"
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Sambutan Kepala Sekolah</h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-6">
              Selamat datang di website resmi SMKN 4 Bogor. Sebagai lembaga pendidikan kejuruan,
              kami berkomitmen untuk menghasilkan lulusan yang kompeten, berkarakter, dan siap
              menghadapi tantangan dunia kerja modern.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              Dengan dukungan fasilitas modern dan tenaga pengajar profesional, kami terus berinovasi 
              dalam memberikan pendidikan berkualitas bagi generasi penerus bangsa.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Program Keahlian */}
      <section className="py-24 px-4 md:px-8 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-16 text-white"
          >
            Program Keahlian
          </motion.h2>
          
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {jurusans.map((jurusan, index) => (
              <motion.div
                key={jurusan.id}
                variants={fadeIn}
                className="bg-zinc-900 rounded-2xl overflow-hidden shadow-xl"
              >
                <div className="p-8">
                  <div className="flex flex-col gap-6">
                    {/* Icon dan Gambar Container */}
                    <div className="flex gap-4 items-center">
                      {/* Icon */}
                      <div className={`relative w-16 h-16 rounded-xl overflow-hidden ${jurusan.warna} flex items-center justify-center flex-shrink-0`}>
                        {jurusan.id === 1 && (
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                          </svg>
                        )}
                        {jurusan.id === 2 && (
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                          </svg>
                        )}
                        {jurusan.id === 3 && (
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                          </svg>
                        )}
                        {jurusan.id === 4 && (
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        )}
                      </div>
                      {/* Gambar */}
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={jurusan.image}
                          alt={jurusan.nama}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* Konten */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{jurusan.nama}</h3>
                        <p className="text-gray-400 text-sm">{jurusan.deskripsi}</p>
                      </div>
                      <Link 
                        href="/jurusan"
                        className="inline-flex items-center text-white hover:gap-2 transition-all duration-300"
                      >
                        <span>Pelajari Lebih Lanjut</span>
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Agenda dan Informasi */}
      <section className="py-24 px-4 md:px-8 bg-[#f8f8f8]">
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12"
        >
          {/* Agenda */}
          <motion.div variants={fadeIn} className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-8 text-gray-900">Agenda</h2>
            <div className="space-y-6">
              {agendas.map((agenda) => (
                <div key={agenda.id} className="flex gap-4">
                  {/* Foto Agenda */}
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    {agenda.post?.galery?.[0]?.foto?.[0]?.file ? (
                      <Image
                        src={agenda.post.galery[0].foto[0].file}
                        alt={agenda.judul}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Konten Agenda */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-500">
                        {new Date(agenda.tanggal).toLocaleDateString('id-ID', { 
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      {agenda.waktu && (
                        <span className="text-sm text-blue-600">
                          {agenda.waktu}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{agenda.judul}</h3>
                    {agenda.lokasi && (
                      <p className="text-sm text-gray-600">{agenda.lokasi}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Informasi */}
          <motion.div variants={fadeIn} className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-8 text-gray-900">Informasi</h2>
            <div className="space-y-6">
              {informasis.map((info) => (
                <div key={info.id} className="flex gap-4 border-b pb-6">
                  {/* Foto Informasi */}
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    {info.post?.galery?.[0]?.foto?.[0]?.file ? (
                      <Image
                        src={info.post.galery[0].foto[0].file}
                        alt={info.judul}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Konten Informasi */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        info.keterangan === 'penting' ? 'bg-red-500/20 text-red-500' :
                        info.keterangan === 'pengumuman' ? 'bg-blue-500/20 text-blue-500' :
                        'bg-gray-500/20 text-gray-500'
                      }`}>
                        {info.keterangan}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(info.tanggal).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{info.judul}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{info.isi}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Galeri */}
      <section className="py-24 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-16 text-gray-900"
          >
            Galeri Kegiatan
          </motion.h2>
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {fotos.map((foto, index) => (
              <motion.div
                key={foto.id}
                variants={fadeIn}
                className="relative aspect-square group overflow-hidden rounded-xl"
              >
                <Image
                  src={foto.file}
                  alt={foto.judul}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white/90 mb-2">
                      {foto.galery?.post?.kategori?.judul}
                    </span>
                    <h3 className="text-white font-bold text-xl">
                      {foto.judul}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <div className="text-center mt-8">
            <Link 
              href="/galeri"
              className="inline-block px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
            >
              Lihat Semua Galeri
            </Link>
          </div>
        </div>
      </section>

      {/* Statistik Pengunjung */}
      <section className="py-24 px-4 md:px-8 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-16"
          >
            Statistik Pengunjung
          </motion.h2>
          
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {/* Total Siswa */}
            <motion.div
              variants={fadeIn}
              className="text-center"
            >
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="text-4xl font-bold mb-2">1200+</div>
                <div className="text-gray-300">Total Siswa</div>
              </div>
            </motion.div>

            {/* Total Guru */}
            <motion.div
              variants={fadeIn}
              className="text-center"
            >
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="text-4xl font-bold mb-2">80+</div>
                <div className="text-gray-300">Tenaga Pengajar</div>
              </div>
            </motion.div>

            {/* Total Alumni */}
            <motion.div
              variants={fadeIn}
              className="text-center"
            >
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="text-4xl font-bold mb-2">5000+</div>
                <div className="text-gray-300">Alumni</div>
              </div>
            </motion.div>

            {/* Mitra Industri */}
            <motion.div
              variants={fadeIn}
              className="text-center"
            >
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-gray-300">Mitra Industri</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Additional Stats */}
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12"
          >
            {/* Tingkat Kelulusan */}
            <motion.div
              variants={fadeIn}
              className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="text-lg">Tingkat Kelulusan</div>
                <div className="text-2xl font-bold">98%</div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-white h-2.5 rounded-full" style={{ width: '98%' }}></div>
              </div>
            </motion.div>

            {/* Tingkat Penyerapan Kerja */}
            <motion.div
              variants={fadeIn}
              className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="text-lg">Tingkat Penyerapan Kerja</div>
                <div className="text-2xl font-bold">85%</div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-white h-2.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mitra Industri */}
      <section className="py-24 px-4 md:px-8 bg-blue-900 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-16 text-gray-900"
          >
            Mitra Industri
          </motion.h2>
          
          {/* Infinite Scroll Container */}
          <div className="relative">
            <div className="flex gap-8 animate-scroll">
              {/* First set of logos */}
              <div className="flex gap-8 min-w-max">
                <div className="w-[200px] h-[100px] flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
                  <Image
                    src="/bonet.png"
                    alt="Partner 1"
                    width={150}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <div className="w-[200px] h-[100px] flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
                  <Image
                    src="/honda.svg"
                    alt="Partner 2"
                    width={150}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <div className="w-[200px] h-[100px] flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
                  <Image
                    src="/komatsu.svg"
                    alt="Partner 3"
                    width={150}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <div className="w-[200px] h-[100px] flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
                  <Image
                    src="/iconnet.png"
                    alt="Partner 4"
                    width={150}
                    height={80}
                    className="object-contain"
                  />
                </div>
              </div>
              {/* Duplicate set for seamless scrolling */}
              <div className="flex gap-8 min-w-max">
                <div className="w-[200px] h-[100px] flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
                  <Image
                    src="/bonet.png"
                    alt="Partner 1"
                    width={150}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <div className="w-[200px] h-[100px] flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
                  <Image
                    src="/honda.svg"
                    alt="Partner 2"
                    width={150}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <div className="w-[200px] h-[100px] flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
                  <Image
                    src="/komatsu.svg"
                    alt="Partner 3"
                    width={150}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <div className="w-[200px] h-[100px] flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
                  <Image
                    src="/iconnet.png"
                    alt="Partner 4"
                    width={150}
                    height={80}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
