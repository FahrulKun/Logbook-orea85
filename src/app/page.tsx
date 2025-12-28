'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Calendar, TrendingUp, Filter, Plus, X, ChevronDown, Search, ChevronLeft, ChevronRight, Share2, Download } from 'lucide-react';
import { format, startOfWeek, endOfWeek, isWithinInterval, parseISO, subWeeks, addWeeks } from 'date-fns';

interface LogEntry {
  id: string;
  date: string;
  day: number;
  treatmentName: string;
  commission: number;
  inputTime: string;
}

const treatments = [
  { name: 'Chair Refleksi 1 jam', commission: 30000 },
  { name: 'Chair Refleksi 1,5 jam', commission: 45000 },
  { name: 'Chair Refleksi 2 jam', commission: 60000 },
  { name: 'FB 1,5 jam', commission: 52500 },
  { name: 'FB 2 jam', commission: 67500 },
  { name: 'FB + Lulur 1,5 jam', commission: 67500 },
  { name: 'FB + Lulur 2 jam', commission: 82500 },
  { name: 'FB + Totok Wajah 1,5 jam', commission: 61500 },
  { name: 'FB + Totok Wajah 2 jam', commission: 76500 },
  { name: 'FB + Kerokan 1,5 jam', commission: 61500 },
  { name: 'FB + Kerokan 2 jam', commission: 76500 },
  { name: 'FB + Refleksi 1,5 jam', commission: 61500 },
  { name: 'FB + Refleksi 2 jam', commission: 76500 },
  { name: 'Sport Massage 1 jam', commission: 45000 },
  { name: 'Sport Massage 1,5 jam', commission: 58500 },
  { name: 'Prenatal 1,5 jam', commission: 67500 },
  { name: 'Prenatal 2 jam', commission: 76500 },
  { name: 'Prenatal + Lulur 1,5 jam', commission: 75000 },
  { name: 'Prenatal + Lulur 2 jam', commission: 93750 },
  { name: 'Post Natal 1 jam', commission: 52500 },
  { name: 'Pijat Laktasi 30 menit', commission: 45000 },
  { name: 'Bengkung 30 menit', commission: 37500 },
  { name: 'Post Natal Paket 2 jam', commission: 127500 },
  { name: 'Brazilian Lympatic 1 jam', commission: 157750 },
  { name: 'Brazilian Lympatic 1,5 jam', commission: 228750 },
  { name: 'Facial Lympatic 30 menit', commission: 52500 },
  { name: 'Manual Lympatic 1 jam', commission: 116250 },
  { name: 'Add on FB 30 menit', commission: 16500 },
  { name: 'Add on FB 1 jam', commission: 33500 },
  { name: 'Add on Lulur 30 menit', commission: 30000 },
  { name: 'Add on Totok Wajah 30 menit', commission: 24000 },
  { name: 'Add on Kerokan 30 menit', commission: 24000 },
  { name: 'Add on Refleksi FB 30 menit', commission: 24000 },
  { name: 'Add on Refleksi Chair 30 menit', commission: 18000 },
];

const getWIBTime = () => {
  const now = new Date();
  return new Date(now.getTime() + (7 * 60 * 60 * 1000) + (now.getTimezoneOffset() * 60 * 1000));
};

const getWIBTimeString = () => {
  const wibTime = getWIBTime();
  return wibTime.toLocaleTimeString('id-ID', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

const getWIBDateString = () => {
  const wibTime = getWIBTime();
  return wibTime.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getDayOfWeek = (date: Date): number => {
  const day = date.getDay();
  return day === 0 ? 1 : day + 1;
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function CatatanHarianKomisiTreatment() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedTreatment, setSelectedTreatment] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [commission, setCommission] = useState<string>('');
  const [filterStart, setFilterStart] = useState<string>('');
  const [filterEnd, setFilterEnd] = useState<string>('');
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [isTreatmentPopupOpen, setIsTreatmentPopupOpen] = useState<boolean>(false);
  const [treatmentSearch, setTreatmentSearch] = useState<string>('');
  const [currentWeekOffset, setCurrentWeekOffset] = useState<number>(0);
  const [showShareMenu, setShowShareMenu] = useState<boolean>(false);
  const [showSharePreview, setShowSharePreview] = useState<boolean>(false);
  const [sharePreviewText, setSharePreviewText] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; treatmentName: string; date: string } | null>(null);
  const [dateUpdateTrigger, setDateUpdateTrigger] = useState<number>(0);
  const [maxDateWIB, setMaxDateWIB] = useState<string>('');
  const [currentTimeWIB, setCurrentTimeWIB] = useState<string>('');
  const popupRef = useRef<HTMLDivElement>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const sharePreviewRef = useRef<HTMLDivElement>(null);
  const lastDateRef = useRef<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const savedLogs = localStorage.getItem('komisiLogs');
    if (savedLogs) {
      const parsedLogs = JSON.parse(savedLogs);
      const migratedLogs = parsedLogs.map((log: any) => ({
        ...log,
        inputTime: log.inputTime || '-'
      }));
      setLogs(migratedLogs);
    }
  }, []);

  useEffect(() => {
    const getCurrentDateString = () => {
      return getWIBTime().toISOString().split('T')[0];
    };

    const updateDateState = () => {
      const today = getCurrentDateString();
      const wibNow = getWIBTime();
      
      setCurrentTimeWIB(getWIBTimeString());
      
      if (lastDateRef.current !== today) {
        console.log('WIB Date changed from', lastDateRef.current, 'to', today);
        lastDateRef.current = today;
        setSelectedDate(today);
        setMaxDateWIB(today);
        setDateUpdateTrigger(prev => prev + 1);
        
        const dateInput = document.getElementById('date') as HTMLInputElement;
        if (dateInput) {
          dateInput.value = today;
          dateInput.max = today;
        }
      }
    };

    updateDateState();
    const dateCheckInterval = setInterval(updateDateState, 60000);
    const timeUpdateInterval = setInterval(() => {
      setCurrentTimeWIB(getWIBTimeString());
    }, 1000);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateDateState();
        setCurrentTimeWIB(getWIBTimeString());
      }
    };

    const handleFocus = () => {
      updateDateState();
      setCurrentTimeWIB(getWIBTimeString());
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(dateCheckInterval);
      clearInterval(timeUpdateInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('komisiLogs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    const todayWIB = getWIBTime().toISOString().split('T')[0];
    setSelectedDate(todayWIB);
    setMaxDateWIB(todayWIB);
    setCurrentTimeWIB(getWIBTimeString());
    lastDateRef.current = todayWIB;
  }, []);

  useEffect(() => {
    console.log('Date update trigger fired, re-rendering component');
  }, [dateUpdateTrigger]);

  useEffect(() => {
    if (selectedTreatment) {
      const treatment = treatments.find(t => t.name === selectedTreatment);
      if (treatment) {
        setCommission(treatment.commission.toString());
      }
    } else {
      setCommission('');
    }
  }, [selectedTreatment]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsTreatmentPopupOpen(false);
      }
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
      if (sharePreviewRef.current && !sharePreviewRef.current.contains(event.target as Node)) {
        setShowSharePreview(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredTreatments = treatments.filter(treatment =>
    treatment.name.toLowerCase().includes(treatmentSearch.toLowerCase())
  );

  const handleTreatmentSelect = (treatment: { name: string; commission: number }) => {
    setSelectedTreatment(treatment.name);
    setCommission(treatment.commission.toString());
    setIsTreatmentPopupOpen(false);
    setTreatmentSearch('');
  };

  const handlePopupClose = () => {
    setIsTreatmentPopupOpen(false);
    setTreatmentSearch('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTreatment || !selectedDate || !commission) {
      return;
    }

    const dateObj = new Date(selectedDate);
    const inputTimeWIB = getWIBTimeString();
    const newLog: LogEntry = {
      id: Date.now().toString(),
      date: selectedDate,
      day: getDayOfWeek(dateObj),
      treatmentName: selectedTreatment,
      commission: parseInt(commission),
      inputTime: inputTimeWIB,
    };

    setLogs([newLog, ...logs]);
    
    setSelectedTreatment('');
    setCommission('');
  };

  const handleDelete = (id: string, treatmentName: string, date: string) => {
    setDeleteConfirm({ id, treatmentName, date });
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      setLogs(logs.filter(log => log.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const getWeeklyLogs = (weekOffset: number = 0): LogEntry[] => {
    const wibNow = getWIBTime();
    const targetDate = weekOffset === 0 ? wibNow : addWeeks(wibNow, weekOffset);
    const weekStart = startOfWeek(targetDate, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(targetDate, { weekStartsOn: 0 });

    return logs.filter(log => {
      const logDate = parseISO(log.date);
      return isWithinInterval(logDate, { start: weekStart, end: weekEnd });
    });
  };

  const getWeeklyTotal = (weekOffset: number = 0): number => {
    return getWeeklyLogs(weekOffset).reduce((total, log) => total + log.commission, 0);
  };

  const getMostFrequentTreatment = (weekOffset: number = 0): string => {
    const weeklyLogs = getWeeklyLogs(weekOffset);
    if (weeklyLogs.length === 0) return '-';

    const treatmentCounts = weeklyLogs.reduce((acc, log) => {
      acc[log.treatmentName] = (acc[log.treatmentName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostFrequent = Object.entries(treatmentCounts).reduce((a, b) => 
      treatmentCounts[a[0]] > treatmentCounts[b[0]] ? a : b
    );

    return mostFrequent[0];
  };

  const getWeekDisplay = (weekOffset: number): string => {
    const wibNow = getWIBTime();
    const targetDate = weekOffset === 0 ? wibNow : addWeeks(wibNow, weekOffset);
    const weekStart = startOfWeek(targetDate, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(targetDate, { weekStartsOn: 0 });

    if (weekOffset === 0) {
      return `Minggu Ini (${format(weekStart, 'dd MMM')} - ${format(weekEnd, 'dd MMM')})`;
    } else if (weekOffset === -1) {
      return `Minggu Lalu (${format(weekStart, 'dd MMM')} - ${format(weekEnd, 'dd MMM')})`;
    } else {
      return `${format(weekStart, 'dd MMM')} - ${format(weekEnd, 'dd MMM')}`;
    }
  };

  const applyFilter = () => {
    if (!filterStart && !filterEnd) {
      setFilteredLogs([]);
      return;
    }

    let filtered = logs;
    
    if (filterStart) {
      filtered = filtered.filter(log => log.date >= filterStart);
    }
    
    if (filterEnd) {
      filtered = filtered.filter(log => log.date <= filterEnd);
    }

    setFilteredLogs(filtered);
  };

  const getFilteredTotal = (): number => {
    return filteredLogs.reduce((total, log) => total + log.commission, 0);
  };

  const shareToWhatsApp = (data: LogEntry[]) => {
    const message = formatShareData(data);
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setShowSharePreview(false);
  };

  const shareToTelegram = (data: LogEntry[]) => {
    const message = formatShareData(data);
    const telegramUrl = `https://t.me/share/url?url=&text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
    setShowSharePreview(false);
  };

  const copyToClipboard = (data: LogEntry[]) => {
    const message = formatShareData(data);
    navigator.clipboard.writeText(message);
    alert('Data berhasil disalin ke clipboard!');
    setShowSharePreview(false);
  };

  const exportToCSV = (data: LogEntry[]) => {
    const headers = ['Tanggal', 'Hari', 'Nama Treatment', 'Komisi'];
    const rows = data.map(log => [
      log.date,
      `Hari ke-${log.day}`,
      log.treatmentName,
      formatCurrency(log.commission)
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `laporan-komisi-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const formatShareData = (data: LogEntry[]): string => {
    if (data.length === 0) return 'No data to share';
    
    const groupedData = data.reduce((acc, log) => {
      const date = log.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(log);
      return acc;
    }, {} as Record<string, LogEntry[]>);

    const sortedDates = Object.keys(groupedData).sort();
    const startDate = new Date(sortedDates[0] + 'T00:00:00');
    const endDate = new Date(sortedDates[sortedDates.length - 1] + 'T00:00:00');
    
    let text = `📋 CATATAN KOMISI TREATMENT - OREA 85\n`;
    text += `📅 ${getWIBDateString()}\n`;
    text += `${'='.repeat(50)}\n\n`;

    let globalCounter = 1;
    let totalCommission = 0;

    Object.keys(groupedData).sort((a, b) => b.localeCompare(a)).forEach(date => {
      const dateObj = new Date(date + 'T00:00:00');
      const formattedDate = dateObj.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      text += `📅 ${formattedDate}\n`;
      text += `${'-'.repeat(30)}\n`;

      groupedData[date].forEach(entry => {
        text += `${globalCounter++}. ${entry.inputTime} - ${entry.treatmentName}\n`;
        text += `   Treatment: ${entry.treatmentName}\n`;
        text += `   Komisi: ${formatCurrency(entry.commission)}\n`;
        if (entry.inputTime !== '-') {
          text += `   Waktu Input: ${entry.inputTime}\n`;
        }
        text += '\n';
        totalCommission += entry.commission;
      });
    });

    text += `${'='.repeat(50)}\n`;
    text += `💰 TOTAL KOMISI: ${formatCurrency(totalCommission)}\n`;
    text += `📊 TOTAL ENTRY: ${data.length} treatment\n`;
    text += `${'='.repeat(50)}\n`;
    text += `📱 Instagram: @OREA_85\n`;
    text += `🏢 OREA 85 - Luxury Treatment Center`;

    return text;
  };

  const currentWeekLogs = getWeeklyLogs(currentWeekOffset);
  const currentWeekTotal = getWeeklyTotal(currentWeekOffset);
  const mostFrequentTreatment = getMostFrequentTreatment(currentWeekOffset);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Catatan Harian Komisi Treatment</h1>
              <p className="text-sm opacity-90">OREA 85 - Luxury Treatment Center</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-mono font-bold">{currentTimeWIB}</div>
              <div className="text-sm opacity-90">{getWIBDateString()}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Input Form */}
        <section className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Input Data Treatment</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-medium mb-2">Nama Terapis</Label>
                <Input 
                  type="text" 
                  value={selectedTreatment}
                  onChange={(e) => setSelectedTreatment(e.target.value)}
                  placeholder="Pilih atau ketik nama terapis"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <Label className="block text-sm font-medium mb-2">Tanggal</Label>
                <Input 
                  type="date" 
                  id="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={maxDateWIB}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <Label className="block text-sm font-medium mb-2">Jenis Treatment</Label>
              <div className="relative">
                <Input 
                  type="text" 
                  value={selectedTreatment}
                  onChange={(e) => {
                    setSelectedTreatment(e.target.value);
                    setTreatmentSearch(e.target.value);
                    setIsTreatmentPopupOpen(true);
                  }}
                  placeholder="Ketik untuk mencari treatment..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button 
                  type="button"
                  onClick={() => setIsTreatmentPopupOpen(true)}
                  className="absolute right-2 top-2 p-1"
                  variant="outline"
                  size="sm"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-medium mb-2">Komisi (Rp)</Label>
                <Input 
                  type="number" 
                  value={commission}
                  onChange={(e) => setCommission(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Simpan Data
              </Button>
              <Button type="button" onClick={() => {
                setSelectedTreatment('');
                setCommission('');
              }} className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                Clear
              </Button>
            </div>
          </form>
        </section>

        {/* Statistics Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-sm font-medium text-gray-600">Total Treatment {currentWeekOffset === 0 ? 'Hari Ini' : 'Minggu Ini'}</h3>
            <p className="text-2xl font-bold text-blue-600">{currentWeekLogs.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-sm font-medium text-gray-600">Total Komisi {currentWeekOffset === 0 ? 'Hari Ini' : 'Minggu Ini'}</h3>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(currentWeekTotal)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-sm font-medium text-gray-600">Treatment Paling Sering</h3>
            <p className="text-lg font-semibold text-purple-600">{mostFrequentTreatment}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-sm font-medium text-gray-600">Periode</h3>
            <p className="text-lg font-semibold text-gray-900">{getWeekDisplay(currentWeekOffset)}</p>
          </div>
        </section>

        {/* Week Navigation */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <Button 
            onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
            disabled={currentWeekOffset <= -4}
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4" />
            Minggu Lalu
          </Button>
          <Button 
            onClick={() => setCurrentWeekOffset(0)}
            variant={currentWeekOffset === 0 ? "default" : "outline"}
            size="sm"
          >
            Minggu Ini
          </Button>
          <Button 
            onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
            disabled={currentWeekOffset >= 4}
            variant="outline"
            size="sm"
          >
            Minggu Depan
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Data Table */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Data Treatment {getWeekDisplay(currentWeekOffset)}
            </h2>
            <div className="flex gap-2">
              <Button onClick={() => setShowSharePreview(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button onClick={exportToCSV} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">No</th>
                  <th className="text-left p-2">Tanggal</th>
                  <th className="text-left p-2">Waktu Input</th>
                  <th className="text-left p-2">Terapis</th>
                  <th className="text-left p-2">Treatment</th>
                  <th className="text-right p-2">Komisi</th>
                  <th className="text-center p-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentWeekLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      Belum ada data untuk periode ini
                    </td>
                  </tr>
                ) : (
                  currentWeekLogs.map((log, index) => (
                    <tr key={log.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">{log.date}</td>
                      <td className="p-2">{log.inputTime}</td>
                      <td className="p-2">{log.treatmentName.split(' ')[0]}</td>
                      <td className="p-2">{log.treatmentName}</td>
                      <td className="p-2 text-right">{formatCurrency(log.commission)}</td>
                      <td className="p-2 text-center">
                        <Button 
                          onClick={() => handleDelete(log.id, log.treatmentName, log.date)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-4 mt-auto">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="overflow-hidden mb-2">
              <div className="whitespace-nowrap animate-pulse">
                JANGAN LUPA FOLLOW INSTAGRAM OREA_85 • JANGAN LUPA FOLLOW INSTAGRAM OREA_85 • JANGAN LUPA FOLLOW INSTAGRAM OREA_85 • 
              </div>
            </div>
            <p className="text-sm">© 2024 OREA 85 - All Rights Reserved</p>
          </div>
        </div>
      </footer>

      {/* Treatment Popup */}
      {isTreatmentPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col" ref={popupRef}>
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold mb-4">Pilih Jenis Treatment</h3>
              <Input 
                type="text"
                placeholder="Cari treatment..."
                value={treatmentSearch}
                onChange={(e) => setTreatmentSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              />
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {filteredTreatments.map((treatment, index) => (
                  <div 
                    key={index}
                    onClick={() => handleTreatmentSelect(treatment)}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{treatment.name}</span>
                      <span className="text-green-600 font-semibold">{formatCurrency(treatment.commission)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t">
              <Button 
                onClick={handlePopupClose}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Share Preview Modal */}
      {showSharePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6" ref={sharePreviewRef}>
            <h3 className="text-lg font-semibold mb-4">Preview Data</h3>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg max-h-60 overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap">{sharePreviewText}</pre>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => shareToWhatsApp(currentWeekLogs)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                WhatsApp
              </Button>
              <Button onClick={() => shareToTelegram(currentWeekLogs)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Telegram
              </Button>
              <Button onClick={() => copyToClipboard(currentWeekLogs)} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                Copy
              </Button>
              <Button onClick={() => setShowSharePreview(false)} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h3>
            <p className="mb-6">
              Apakah Anda yakin ingin menghapus data ini?<br><br>
              <strong>Tanggal:</strong> {deleteConfirm.date}<br>
              <strong>Treatment:</strong> {deleteConfirm.treatmentName}<br>
              <strong>Komisi:</strong> {formatCurrency(logs.find(l => l.id === deleteConfirm.id)?.commission || 0)}
            </p>
            <div className="flex gap-2">
              <Button onClick={confirmDelete} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                Hapus
              </Button>
              <Button onClick={cancelDelete} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                Batal
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}