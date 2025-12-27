// Aplikasi Catatan Harian Komisi Treatment - Vanilla JavaScript
class TreatmentApp {
    constructor() {
        this.data = [];
        this.currentDeleteId = null;
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.updateClock();
        this.setDefaultDate();
        this.updateStatistics();
        this.renderTable();
        this.updateMarquee();
        
        // Update clock every second
        setInterval(() => this.updateClock(), 1000);
        
        // Auto update date at midnight WIB
        this.scheduleDateUpdate();
    }

    // Data Management
    loadData() {
        const stored = localStorage.getItem('treatmentData');
        if (stored) {
            this.data = JSON.parse(stored);
        }
    }

    saveData() {
        localStorage.setItem('treatmentData', JSON.stringify(this.data));
        this.updateStatistics();
        this.renderTable();
        this.updateMarquee();
    }

    // Clock and Date Functions
    updateClock() {
        const now = new Date();
        const wibTime = new Date(now.getTime() + (7 * 60 * 60 * 1000)); // WIB = UTC+7
        
        const timeString = wibTime.toLocaleTimeString('id-ID', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const dateString = wibTime.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        document.getElementById('digitalClock').textContent = timeString;
        document.getElementById('currentDate').textContent = dateString;
    }

    setDefaultDate() {
        const now = new Date();
        const wibTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
        const dateString = wibTime.toISOString().split('T')[0];
        document.getElementById('treatmentDate').value = dateString;
    }

    scheduleDateUpdate() {
        const now = new Date();
        const wibTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
        
        const tomorrow = new Date(wibTime);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const msUntilMidnight = tomorrow.getTime() - wibTime.getTime();
        
        setTimeout(() => {
            this.setDefaultDate();
            this.scheduleDateUpdate();
        }, msUntilMidnight);
    }

    // Form Handling
    setupEventListeners() {
        // Form submission
        document.getElementById('treatmentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addEntry();
        });

        // Clear form
        document.getElementById('clearForm').addEventListener('click', () => {
            this.clearForm();
        });

        // Treatment type change
        document.getElementById('treatmentType').addEventListener('change', (e) => {
            this.updatePrice(e.target.value);
        });

        // Share button
        document.getElementById('shareBtn').addEventListener('click', () => {
            this.showShareModal();
        });

        // Export button
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportToCSV();
        });

        // Share modal buttons
        document.getElementById('shareWhatsApp').addEventListener('click', () => {
            this.shareToWhatsApp();
        });

        document.getElementById('shareTelegram').addEventListener('click', () => {
            this.shareToTelegram();
        });

        document.getElementById('copyData').addEventListener('click', () => {
            this.copyToClipboard();
        });

        document.getElementById('closeShareModal').addEventListener('click', () => {
            this.hideShareModal();
        });

        // Delete modal buttons
        document.getElementById('confirmDelete').addEventListener('click', () => {
            this.confirmDelete();
        });

        document.getElementById('cancelDelete').addEventListener('click', () => {
            this.hideDeleteModal();
        });

        // Close modals on backdrop click
        document.getElementById('shareModal').addEventListener('click', (e) => {
            if (e.target.id === 'shareModal') {
                this.hideShareModal();
            }
        });

        document.getElementById('deleteModal').addEventListener('click', (e) => {
            if (e.target.id === 'deleteModal') {
                this.hideDeleteModal();
            }
        });
    }

    updatePrice(treatmentValue) {
        const priceMatch = treatmentValue.match(/: ([\d.]+)/);
        if (priceMatch) {
            const price = parseInt(priceMatch[1].replace(/\./g, ''));
            document.getElementById('price').value = price;
            
            // Calculate commission (30% of price)
            const commission = Math.round(price * 0.3);
            document.getElementById('commission').value = commission;
        }
    }

    addEntry() {
        const therapistName = document.getElementById('therapistName').value.trim();
        const treatmentDate = document.getElementById('treatmentDate').value;
        const treatmentType = document.getElementById('treatmentType').value;
        const price = parseInt(document.getElementById('price').value) || 0;
        const commission = parseInt(document.getElementById('commission').value) || 0;
        const notes = document.getElementById('notes').value.trim();

        if (!therapistName || !treatmentDate || !treatmentType || !price || !commission) {
            this.showToast('Mohon lengkapi semua field yang diperlukan', 'error');
            return;
        }

        const now = new Date();
        const wibTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
        const inputTime = wibTime.toLocaleTimeString('id-ID', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });

        const entry = {
            id: Date.now().toString(),
            therapistName,
            date: treatmentDate,
            inputTime,
            treatmentType,
            price,
            commission,
            notes,
            createdAt: wibTime.toISOString()
        };

        this.data.push(entry);
        this.saveData();
        this.clearForm();
        this.showToast('Data berhasil disimpan!', 'success');
    }

    clearForm() {
        document.getElementById('treatmentForm').reset();
        this.setDefaultDate();
    }

    // Statistics
    updateStatistics() {
        const now = new Date();
        const wibTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
        const today = wibTime.toISOString().split('T')[0];
        const currentMonth = wibTime.toISOString().slice(0, 7);

        const todayData = this.data.filter(entry => entry.date === today);
        const monthData = this.data.filter(entry => entry.date.startsWith(currentMonth));

        const todayTotal = todayData.length;
        const todayCommission = todayData.reduce((sum, entry) => sum + entry.commission, 0);
        const monthTotal = monthData.length;
        const monthCommission = monthData.reduce((sum, entry) => sum + entry.commission, 0);

        document.getElementById('todayTotal').textContent = todayTotal;
        document.getElementById('todayCommission').textContent = `Rp ${todayCommission.toLocaleString('id-ID')}`;
        document.getElementById('monthTotal').textContent = monthTotal;
        document.getElementById('monthCommission').textContent = `Rp ${monthCommission.toLocaleString('id-ID')}`;
    }

    // Marquee
    updateMarquee() {
        const treatmentCounts = {};
        this.data.forEach(entry => {
            const treatment = entry.treatmentType.split(':')[0].trim();
            treatmentCounts[treatment] = (treatmentCounts[treatment] || 0) + 1;
        });

        const sortedTreatments = Object.entries(treatmentCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);

        if (sortedTreatments.length > 0) {
            const marqueeText = sortedTreatments
                .map(([treatment, count]) => `${treatment} (${count}x)`)
                .join(' • ');
            document.getElementById('marqueeText').textContent = marqueeText;
        } else {
            document.getElementById('marqueeText').textContent = 'Belum ada data treatment';
        }
    }

    // Table Rendering
    renderTable() {
        const tbody = document.getElementById('dataTableBody');
        
        if (this.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="text-center py-4 text-gray-500">Belum ada data</td></tr>';
            return;
        }

        // Sort by date and time (newest first)
        const sortedData = [...this.data].sort((a, b) => {
            const dateCompare = b.date.localeCompare(a.date);
            if (dateCompare !== 0) return dateCompare;
            return b.inputTime.localeCompare(a.inputTime);
        });

        // Group by date
        const groupedData = {};
        sortedData.forEach(entry => {
            if (!groupedData[entry.date]) {
                groupedData[entry.date] = [];
            }
            groupedData[entry.date].push(entry);
        });

        let html = '';
        let globalCounter = 1;

        Object.keys(groupedData).sort((a, b) => b.localeCompare(a)).forEach(date => {
            const entries = groupedData[date];
            const dateObj = new Date(date + 'T00:00:00');
            const formattedDate = dateObj.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Date header row
            html += `<tr class="bg-gray-100 font-semibold">
                <td colspan="9" class="p-3 text-left">${formattedDate}</td>
            </tr>`;

            // Data rows
            entries.forEach(entry => {
                html += `
                    <tr class="border-b hover:bg-gray-50">
                        <td class="p-2">${globalCounter++}</td>
                        <td class="p-2">${entry.date}</td>
                        <td class="p-2">${entry.inputTime}</td>
                        <td class="p-2">${entry.therapistName}</td>
                        <td class="p-2">${entry.treatmentType}</td>
                        <td class="p-2 text-right">Rp ${entry.price.toLocaleString('id-ID')}</td>
                        <td class="p-2 text-right">Rp ${entry.commission.toLocaleString('id-ID')}</td>
                        <td class="p-2">${entry.notes || '-'}</td>
                        <td class="p-2 text-center">
                            <button onclick="app.showDeleteModal('${entry.id}')" 
                                    class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors">
                                Hapus
                            </button>
                        </td>
                    </tr>
                `;
            });
        });

        tbody.innerHTML = html;
    }

    // Delete Functions
    showDeleteModal(id) {
        const entry = this.data.find(e => e.id === id);
        if (!entry) return;

        this.currentDeleteId = id;
        
        const dateObj = new Date(entry.date + 'T00:00:00');
        const formattedDate = dateObj.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        document.getElementById('deleteMessage').innerHTML = `
            <strong>Apakah Anda yakin ingin menghapus data ini?</strong><br><br>
            <strong>Tanggal:</strong> ${formattedDate}<br>
            <strong>Waktu Input:</strong> ${entry.inputTime}<br>
            <strong>Terapis:</strong> ${entry.therapistName}<br>
            <strong>Treatment:</strong> ${entry.treatmentType}<br>
            <strong>Komisi:</strong> Rp ${entry.commission.toLocaleString('id-ID')}
        `;

        document.getElementById('deleteModal').classList.remove('hidden');
        document.body.classList.add('modal-open');
    }

    hideDeleteModal() {
        document.getElementById('deleteModal').classList.add('hidden');
        document.body.classList.remove('modal-open');
        this.currentDeleteId = null;
    }

    confirmDelete() {
        if (this.currentDeleteId) {
            this.data = this.data.filter(entry => entry.id !== this.currentDeleteId);
            this.saveData();
            this.showToast('Data berhasil dihapus', 'success');
            this.hideDeleteModal();
        }
    }

    // Share Functions
    showShareModal() {
        if (this.data.length === 0) {
            this.showToast('Tidak ada data untuk dibagikan', 'error');
            return;
        }

        const shareText = this.generateShareText();
        document.getElementById('sharePreview').innerHTML = `<pre class="whitespace-pre-wrap text-sm">${shareText}</pre>`;
        document.getElementById('shareModal').classList.remove('hidden');
        document.body.classList.add('modal-open');
    }

    hideShareModal() {
        document.getElementById('shareModal').classList.add('hidden');
        document.body.classList.remove('modal-open');
    }

    generateShareText() {
        if (this.data.length === 0) return 'Tidak ada data';

        // Sort by date (newest first)
        const sortedData = [...this.data].sort((a, b) => {
            const dateCompare = b.date.localeCompare(a.date);
            if (dateCompare !== 0) return dateCompare;
            return b.inputTime.localeCompare(a.inputTime);
        });

        // Group by date
        const groupedData = {};
        sortedData.forEach(entry => {
            if (!groupedData[entry.date]) {
                groupedData[entry.date] = [];
            }
            groupedData[entry.date].push(entry);
        });

        let text = `📋 CATATAN KOMISI TREATMENT - OREA 85\n`;
        text += `📅 ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n`;
        text += `${'='.repeat(50)}\n\n`;

        let globalCounter = 1;
        let totalCommission = 0;

        Object.keys(groupedData).sort((a, b) => b.localeCompare(a)).forEach(date => {
            const entries = groupedData[date];
            const dateObj = new Date(date + 'T00:00:00');
            const formattedDate = dateObj.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            text += `📅 ${formattedDate}\n`;
            text += `${'-'.repeat(30)}\n`;

            entries.forEach(entry => {
                text += `${globalCounter++}. ${entry.inputTime} - ${entry.therapistName}\n`;
                text += `   Treatment: ${entry.treatmentType}\n`;
                text += `   Komisi: Rp ${entry.commission.toLocaleString('id-ID')}\n`;
                if (entry.notes) {
                    text += `   Catatan: ${entry.notes}\n`;
                }
                text += '\n';
                totalCommission += entry.commission;
            });
        });

        text += `${'='.repeat(50)}\n`;
        text += `💰 TOTAL KOMISI: Rp ${totalCommission.toLocaleString('id-ID')}\n`;
        text += `📊 TOTAL ENTRY: ${this.data.length} treatment\n`;
        text += `${'='.repeat(50)}\n`;
        text += `📱 Instagram: @OREA_85\n`;
        text += `🏢 OREA 85 - Luxury Treatment Center`;

        return text;
    }

    shareToWhatsApp() {
        const text = this.generateShareText();
        const encodedText = encodeURIComponent(text);
        window.open(`https://wa.me/?text=${encodedText}`, '_blank');
    }

    shareToTelegram() {
        const text = this.generateShareText();
        const encodedText = encodeURIComponent(text);
        window.open(`https://t.me/share/url?text=${encodedText}`, '_blank');
    }

    async copyToClipboard() {
        try {
            const text = this.generateShareText();
            await navigator.clipboard.writeText(text);
            this.showToast('Data berhasil disalin ke clipboard!', 'success');
        } catch (err) {
            this.showToast('Gagal menyalin data', 'error');
        }
    }

    // Export Functions
    exportToCSV() {
        if (this.data.length === 0) {
            this.showToast('Tidak ada data untuk diekspor', 'error');
            return;
        }

        const csv = this.generateCSV();
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `komisi-treatment-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showToast('Data berhasil diekspor ke CSV!', 'success');
    }

    generateCSV() {
        const headers = [
            'No',
            'Tanggal',
            'Waktu Input',
            'Nama Terapis',
            'Jenis Treatment',
            'Harga',
            'Komisi',
            'Catatan'
        ];

        const rows = this.data.map((entry, index) => [
            index + 1,
            entry.date,
            entry.inputTime,
            entry.therapistName,
            entry.treatmentType,
            entry.price,
            entry.commission,
            entry.notes || ''
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        return '\ufeff' + csvContent; // Add BOM for proper UTF-8 encoding
    }

    // Toast Notification
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        toastMessage.textContent = message;
        
        // Set background color based on type
        if (type === 'error') {
            toast.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-scale-in';
        } else {
            toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-scale-in';
        }
        
        toast.classList.remove('hidden');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TreatmentApp();
});

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}