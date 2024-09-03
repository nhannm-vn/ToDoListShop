//nó sẽ bắt sự kiện submit nghĩa là khi tải dữ liệu lên và load lại trang sẽ chạy event
//dom vào thẻ form
document.querySelector("#form-function-left").addEventListener("click", (event) => {
    if(event.target.classList.contains("btn-add")){
        //ngăn chặn sự kiện nó load lại wed
        event.preventDefault();
        //chức năng thêm mới sản phẩm LS và hiển thị trên UI
        //lấy các giá trị trong ô input
        let name = document.querySelector("#name-product").value;
        //lấy giá sản phẩm
        let price = document.querySelector("#price-product").value;
        //lấy số lượng sản phẩm
        let amount = document.querySelector("#amount-product").value;
        //lấy mô tả
        let descript = document.querySelector("#descript-product").value;
        //tạo ra item(object) từ các thông tin
        let item = {
            //thêm cái id tự động để dễ quản lí
            id: new Date().toISOString(),
            name: name.trim(),
            price: price.trim(),
            amount: amount.trim(),
            descript: descript.trim(),
        };
        //hiển thị trên UI
        addItemToUI(item);
        //lưu trên LS
        addItemToLS(item);
    };
});

//lấy phần danh sách từ localStorage
const getList = () => {
    let list = localStorage.getItem("listProduct");
    return JSON.parse(list) || [];
};

//hàm hiển thị trên UI
const addItemToUI = (item) => {
    //dom vào danh sách các phần tử
    let listProduct = document.querySelector(".list-product");
    //tạo ra phần tử mới
    let newCard = document.createElement("div");
    //thêm class vào phần tử
    newCard.className = "list-product-element mb-3 d-flex flex-column justify-content-between";
    //thêm data-id cho từng phần tử mới
    newCard.setAttribute("data-id", item.id);
    //thêm nội dung vào trong
    newCard.innerHTML = `
                    <div class="product-element-img">
                        <img class="img-element" src="${item.descript}">
                    </div>
                    <div class="product-element-content p-2">
                        <div>${item.name}</div>
                        <div>${item.price}</div>
                        <div>${item.amount}</div>
                    </div>`;
    //lấy card mới bỏ vào thằng list tổng
    listProduct.appendChild(newCard);
};

//hàm lưu dữ liệu lên LS
const addItemToLS = (item) => {
    //lấy danh sách xuống
    let listProduct = getList();
    //thêm item vào list rồi set lại
    listProduct.push(item);
    localStorage.setItem("listProduct", JSON.stringify(listProduct));
};

//hàm gender để không bị mất phần tử
const init = () => {
    let listProduct = getList();
    listProduct.forEach((item) => {
        addItemToUI(item);        
    });
};

init();

//chức năng filter
//móc vô cái nút và kêu nó đợi sự kiện
document.querySelector("#btn-filter").addEventListener("click", (event) => {
    //lấy value của ô input filter
    let value = document.querySelector("#filter").value;
    //xóa hết trên UI 
    //dom vô list-product xóa bên trong
    document.querySelector(".list-product").innerHTML = "";
    //lấy list từ LS xuống
    let listProduct = getList();
    //lọc ra những thằng có value trong tên
    filteredList = listProduct.filter((item) => {
        return item.name.includes(value);
    });
    //hiển thị list filter đó ra màn hình
    if(filteredList.length == 0){
        let confirm1 = confirm(`Không tìm thấy sản phẩm? Bạn có muốn tiếp tục?`);
        if(!confirm1){
            init();
        };
    }else{
        let confirm2 = confirm(`Sản phẩm của bạn đây. Bạn có muốn xem chúng?`);
        if(confirm2){
            filteredList.forEach((item) => {
                addItemToUI(item);
            });
        }else{
            init();
        };
    };
    
});

//click vào phần tử nào thì trả thông tin qua bên trái
//dom tới list ngoài
var idRemove;
document.querySelector(".list-product").addEventListener("click", (event) => {
    //nếu thằng dính sự kiện có chứa class list-product-element thì làm tiếp
    if(event.target.classList.contains("img-element")){
        //bấm vào tấm hình và lần ra cha nó để lấy data-id
        //lấy data-id của nó
        let key = event.target.parentElement.parentElement.getAttribute("data-id");
        //lấy mảng các item từ LS xuống
        let list = getList();
        //duyệt qua các item xem có thằng nào mà id = với data-id không
        let item =  list.find((item) => {
            return item.id == key;
        });
        //lấy các giá trị của nó và bỏ vào ô input lại
        console.log(item);
        //dom vào cho xuất hiện name
        document.querySelector("#name-product").value = item.name;
        //dom vào cho xuất hiện tiền
        document.querySelector("#price-product").value = item.price;
        //dom vào cho xuất hiện số lượng
        document.querySelector("#amount-product").value = item.amount;
        //dom vào cho xuất hiện mô tả
        document.querySelector("#descript-product").value = item.descript;
        idRemove = item.id;
    };
});


//dom vô nút xóa và xóa dựa vào key lấy bên trên
document.querySelector(".btn-delete").addEventListener("click", (event) => {
    //lấy danh sách xuống từ hàm
    let list = getList();
    //duyệt qua từng thằng, thằng nào có id == idRemove thì xóa
    //lọc các th có id khác
    let filteredList = list.filter((item) => item.id != idRemove);
    //hỏi coi bạn có muốn xóa không
    let isConfirmed = confirm(`Bạn có chắc muốn xóa sản phẩm này không?`);
    if(isConfirmed){
        //xóa trên UI
        filteredList.forEach((item) => {
            addItemToUI(item);
        });
        //xóa trên LS
        localStorage.setItem("listProduct", JSON.stringify(filteredList));
    };
});

//chức năng clear xóa hết trong khu input
document.querySelector(".btn-clear").addEventListener("click", (event) => {
    //**cho tất cả có value rỗng
    //dom vào cho xuất hiện name
    document.querySelector("#name-product").value = "";
    //dom vào cho xuất hiện tiền
    document.querySelector("#price-product").value = "";
    //dom vào cho xuất hiện số lượng
    document.querySelector("#amount-product").value = "";
    //dom vào cho xuất hiện mô tả
    document.querySelector("#descript-product").value = "";
});







