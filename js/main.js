
async function loadData() {
  const response = await fetch('json/sample.json')
  const data = await response.json();
  return data;
}

const limit = 8;
document.addEventListener("DOMContentLoaded", ()=> {

  loadData().then(albumData => {

    const copyAlbumData = [...albumData.result]; //배열로 복사
    ascSort(copyAlbumData) //날짜 오름차순 정렬

    //정렬 방식 선택 시 실행
    document.getElementById('sort_order').addEventListener('change', function(e) {
      const selected = e.target.value;
      if(selected == 'asc') {
        ascSort(copyAlbumData) 
      }
      if(selected == 'desc') {
        descSort(copyAlbumData)
      }
    })

    //페이징 버튼 이벤트
    document.addEventListener('click', (e) => {
      //이전 버튼
      if(e.target && e.target.id === 'prev_btn') {
        const prev_num = e.target.dataset.prev
        pagenation(copyAlbumData, parseInt(prev_num)) 
      }
      //다음 버튼
      if(e.target && e.target.id === 'next_btn') {
        const next_num = e.target.dataset.next
        pagenation(copyAlbumData, parseInt(next_num)) 
      }
      //페이징 번호
      if(e.target && e.target.classList.contains('page_btn')) {
        const page_num = e.target.dataset.page
        pageRenderData(copyAlbumData, page_num)//페이징 데이터 렌더링
      }
    })

    // track 검색
    const search_input = document.getElementById('search_input')
      search_input.oninput = (e) => {
      const query = e.target.value
      console.log("oninput => ", query)

      const filterData = copyAlbumData.filter((album) => 
        album.track.trim().toLowerCase().includes(query.trim().toLowerCase() 
      ))  //includes ==> 부분일치(일부)
      console.log(filterData)
      pagenation(filterData, 1)

      if(filterData.length == 0 )
        document.getElementById('no_result_message').style.display = 'block'
      else
        document.getElementById('no_result_message').style.display = 'none'
    }
  })
});


//날짜 오름차순 정렬 함수 
function ascSort(copyAlbumData){
  copyAlbumData.sort((a, b) => {
    return new Date(a.release_date) - new Date(b.release_date);
  });
  copyAlbumData.forEach((arr, index) => {  //데이터 정렬 후 배열에 index값 추가
    arr["index"] = index+1
  })
  pagenation(copyAlbumData, 1)   //배열 index값 추가 후 페이징처리
}


//날짜 내림차순 정렬 함수 
function descSort(copyAlbumData){
  copyAlbumData.sort((a, b) => {
    return new Date(b.release_date) - new Date(a.release_date);
  });
  copyAlbumData.forEach((arr, index) => {    //데이터 정렬 후 배열에 index값 추가
    arr["index"] = index+1
  })
  pagenation(copyAlbumData, 1)   //배열 index값 추가 후 페이징처리
}


//기존 리스트 지우고 새로운 리스트 반환하는 함수
function getSongList(copyAlbumData){
  
  const tbody = document.getElementById('song_list_tbody')
  tbody.textContent = '';
  copyAlbumData.forEach( (element) => { //노드생성
    createElement(element)
  });

}

//조회중인 페이지번호로 색상 변경
function changePageColor(currentPage){
  const buttons = document.querySelectorAll('.page_btn')
  buttons.forEach((button) => {
    button.style.backgroundColor = '#fcfcfc'
    button.style.color = '#000000'
    button.style.border = '1px solid #e5e5e5'
    if(button.dataset.page == currentPage) {
          button.style.backgroundColor = '#3bcb41'
          button.style.color = '#ffffff'
          button.style.border = '0'
    }
  })
}


//페이징 데이터처리 (pagenation => pageRenderData)
function pageRenderData(copyAlbumData, currentPage){

  //slice 시작점과 끝점 index값 구하기
  const start = (currentPage-1) * limit //index값 맞추기위해 -1처리 
  const end = start + limit
  const currentData = copyAlbumData.slice(start, end)
  getSongList(currentData)
  changePageColor(currentPage)
}


//페이징 데이터 구하기
function pagenation(copyAlbumData, pageNum){

  const currentPage = pageNum; //현재 페이지
  const totalCount = copyAlbumData.length; // 총 데이터 개수
  const pageCount = 5; //한 페이지에 페이징번호 표출 개수
  let totalPage = Math.ceil(totalCount/limit) //총 페이지 개수
  let pageGroup = Math.ceil(currentPage/pageCount) //현재 속한 그룹번호
  
  let lastNumber = (pageGroup * pageCount)-1 //그룹 마지막 번호
  if(lastNumber > totalPage)
    lastNumber = totalPage

  let firstNumber;//그룹 첫번째 번호
  if(pageNum >= 1)
    firstNumber = 1;
  if(pageNum >= 6) 
    firstNumber = 6;
  
  let next = lastNumber +1 //그룹 다음페이지 번호
  let prev = firstNumber -1 //그룹 이전페이지 번호
  
  if(prev == 0)
      prev = 1;
  if(next > totalPage)
      next = totalPage;

  let html='';
      html += `<button class="prev_btn" id="prev_btn" data-prev="${prev}">이전</button>`
      for(let i=firstNumber; i<=lastNumber; i++) {
        html +=  `<button class="page_btn" data-page="${i}">${i}</button>`
      }
      html += `<button class="next_btn" id="next_btn" data-next="${next}">다음</button>`
  
      document.getElementById('pagenation_container').innerHTML = html;
  pageRenderData(copyAlbumData, currentPage)

}



//노드 생성함수
function createElement(element){
  let html = '';
  const tbody = document.getElementById('song_list_tbody')
  html += `
        <tr>
          <td class="td_No">${element.index}</td>
            <td class="td_Track">
              <img src="img/866-200x300.jpg" class="albumImg">
                <div class="td_track_cont">                                    
                  <div class="track">${element.track}</div>
                  <div class="artist">${element.artist}</div>
                </div>
            </td>
            <td class="album">${element.album}</td>
            <td class="td_Duration">
                <img src="img/play.png" class="playImg" >
                <span class="duration">${element.duration}</span>
              </td>
            <td class="td_Release_date">${element.release_date}</td>
        </tr>
        `
  tbody.innerHTML += html;
}


//메뉴 클릭 시 색상 변경
const nav_menus = document.querySelectorAll('.nav_menu')
nav_menus.forEach((menu) => {
  menu.addEventListener('click', () => {
    nav_menus.forEach((m) => {
      m.style.borderBottom = '0';
    });

    menu.style.borderBottom = '4px solid #3bcb41';
  });
});