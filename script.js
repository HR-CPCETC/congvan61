const dataUrl = 'https://raw.githubusercontent.com/hr-cpcetc/congvan61/main/data.json';
const itemsPerPage = 10;
let originalData = []; // Lưu trữ dữ liệu gốc
let data = [];
let currentPage = 1;

// Lấy dữ liệu từ file JSON
fetch(dataUrl)
	.then((response) => response.json())
	.then((jsonData) => {
		originalData = jsonData; // Gán dữ liệu gốc
		data = jsonData; // Khởi tạo dữ liệu hiện tại
		renderTable();
	})
	.catch((error) => console.error('Lỗi khi lấy dữ liệu:', error));

// Hiển thị dữ liệu ra bảng
function renderTable() {
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentData = data.slice(startIndex, endIndex);

	const tableBody = document.getElementById('data-table');
	tableBody.innerHTML = ''; // Xóa nội dung cũ

	currentData.forEach((item, index) => {
		const row = tableBody.insertRow();
		// Lấy ô đầu tiên của hàng
		const cell = row.insertCell();

		// Thêm class "text-center" vào ô
		cell.classList.add('text-center');

		// Thêm nội dung vào ô
		cell.textContent = startIndex + index + 1;

		row.insertCell().textContent = item.so_cong_van;
		row.insertCell().textContent = formatDate(item.ngay_cong_van);
		row.insertCell().textContent = item.so_den;
		row.insertCell().textContent = item.trich_yeu;
		row.insertCell().textContent = item.noi_gui;

		// Thêm sự kiện click để mở URL trong tab mới
		row.addEventListener('click', () => {
			window.open(item.url, '_blank');
		});
	});

	renderPagination();
}

// Định dạng ngày tháng
function formatDate(dateString) {
	const date = new Date(dateString);
	const day = date.getDate().toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const year = date.getFullYear();
	return `${day}/${month}/${year}`;
}

// Hiển thị phân trang
function renderPagination() {
	const totalPages = Math.ceil(data.length / itemsPerPage);
	const pagination = document.getElementById('pagination');
	pagination.innerHTML = '';

	// Nút "Trang đầu tiên"
	const firstLi = document.createElement('li');
	firstLi.classList.add('page-item');
	firstLi.innerHTML = `<a class="page-link" href="#" aria-label="First" onclick="changePage(1)">
                          <span aria-hidden="true">&laquo;&laquo;</span>
                      </a>`;
	firstLi.disabled = currentPage === 1;
	pagination.appendChild(firstLi);

	// Nút "Trước"
	const prevLi = document.createElement('li');
	prevLi.classList.add('page-item');
	prevLi.innerHTML = `<a class="page-link" href="#" aria-label="Previous" onclick="changePage(${
		currentPage - 1
	})">
                          <span aria-hidden="true">&laquo;</span>
                      </a>`;
	prevLi.disabled = currentPage === 1;
	pagination.appendChild(prevLi);

	// Hiển thị các nút trang
	const maxVisiblePages = 5;
	let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
	let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
	if (endPage - startPage + 1 < maxVisiblePages) {
		startPage = Math.max(1, endPage - maxVisiblePages + 1);
	}

	if (startPage > 1) {
		// Nút "..." đầu tiên
		const dotsLi = document.createElement('li');
		dotsLi.classList.add('page-item', 'disabled');
		dotsLi.innerHTML = '<span class="page-link">...</span>';
		pagination.appendChild(dotsLi);
	}

	for (let i = startPage; i <= endPage; i++) {
		const li = document.createElement('li');
		li.classList.add('page-item');
		li.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i})">${i}</a>`;
		li.classList.toggle('active', i === currentPage);
		pagination.appendChild(li);
	}

	if (endPage < totalPages) {
		// Nút "..." cuối cùng
		const dotsLi = document.createElement('li');
		dotsLi.classList.add('page-item', 'disabled');
		dotsLi.innerHTML = '<span class="page-link">...</span>';
		pagination.appendChild(dotsLi);
	}

	// Nút "Sau"
	const nextLi = document.createElement('li');
	nextLi.classList.add('page-item');
	nextLi.innerHTML = `<a class="page-link" href="#" aria-label="Next" onclick="changePage(${
		currentPage + 1
	})">
                          <span aria-hidden="true">&raquo;</span>
                      </a>`;
	nextLi.disabled = currentPage === totalPages;
	pagination.appendChild(nextLi);

	// Nút "Trang cuối cùng"
	const lastLi = document.createElement('li');
	lastLi.classList.add('page-item');
	lastLi.innerHTML = `<a class="page-link" href="#" aria-label="Last" onclick="changePage(${totalPages})">
                          <span aria-hidden="true">&raquo;&raquo;</span>
                      </a>`;
	lastLi.disabled = currentPage === totalPages;
	pagination.appendChild(lastLi);

	// Input nhập số trang
	const inputLi = document.createElement('li');
	inputLi.classList.add('page-item');
	inputLi.innerHTML = `
        <input type="number" class="form-control page-input" id="pageNumberInput" placeholder="Trang" min="1" max="${totalPages}">
    `;
	pagination.appendChild(inputLi);

	// Xử lý sự kiện nhập số trang
	const pageNumberInput = document.getElementById('pageNumberInput');
	pageNumberInput.addEventListener('keyup', (event) => {
		if (event.key === 'Enter') {
			const pageNumber = parseInt(pageNumberInput.value);
			if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
				changePage(pageNumber);
			}
		}
	});
}

// Thay đổi trang
function changePage(page) {
	if (page >= 1 && page <= Math.ceil(data.length / itemsPerPage)) {
		currentPage = page;
		renderTable();
	}
}

// Lọc dữ liệu
const searchInput = document.getElementById('searchInput');
const fromDateInput = document.getElementById('fromDate');
const toDateInput = document.getElementById('toDate');
const searchButton = document.getElementById('searchButton');
// Thêm sự kiện "keyup" cho ô tìm kiếm
searchInput.addEventListener('keyup', (event) => {
	if (event.key === 'Enter') {
		searchButton.click(); // Kích hoạt sự kiện click của nút tìm kiếm
	}
});

searchButton.addEventListener('click', () => {
	const searchText = searchInput.value.toLowerCase();
	const fromDate = fromDateInput.value;
	const toDate = toDateInput.value;

	// Lọc từ dữ liệu gốc
	data = originalData.filter((item) => {
		const trichYeuMatch = item.trich_yeu.toLowerCase().includes(searchText);
		const soCongVanMatch = item.so_cong_van.toLowerCase().includes(searchText); // Thêm điều kiện kiểm tra số công văn
		const dateMatch =
			(!fromDate || new Date(item.ngay_cong_van) >= new Date(fromDate)) &&
			(!toDate || new Date(item.ngay_cong_van) <= new Date(toDate));
		return (trichYeuMatch || soCongVanMatch) && dateMatch; // Kết hợp điều kiện
	});

	currentPage = 1;
	renderTable();
});
