import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import BoardWriteModal from './BoardWriteModal';
import { useParams, useNavigate } from 'react-router-dom';

function BoardWrite(props) {
    const [isUpdate, setisUpdate] = useState(props.update);
    const [bbsID, setbbsID] = useState(props.bbsID);
    const [html, setHtml] = useState(props.bbsContent);
    const [title, setTitle] = useState(props.bbsTitle);
    const quillRef = useRef(null);
    const titleref = useRef(null);
    const navigate = useNavigate();
    const [isLogin, setLogin] = useState(false);
    const [active, setactive] = useState(false);
    const [img, setimg] = useState('');
    const [tag, settag] = useState([]);
    const { bbsWriteID } = useParams();

    useEffect(() => {
        loginCheckSubmit();
        selectbbsInfo()
    }, []);

    const selectbbsInfo = () => {
        const url = "/board/selectBbsIDInfo";
        const data = {bbsID:bbsWriteID};
        axios.post(url, data, { withCredentials: true })
            .then((response)=>{
                let newContents = Array.from(tag);
                response.data.forEach((e) => {
                    newContents.push(e.hashTag);
                    setTitle(e.bbsTitle);
                    setHtml(e.bbsContent);
                    setimg(e.bbsImage);
                    setbbsID(bbsWriteID)
                })
                settag(newContents)
            })
    }

    const loginCheck = () => {
        const url = '/board/loginCheck';
        const data = {};
        return axios.post(url, data, { withCredentials: true });
    }
    const loginCheckSubmit = () => {
        loginCheck()
            .then((response) => {
                if (response.data === false) {
                    setLogin(false);
                    alert("다시 로그인 해주세요");
                    navigate('/Main');
                }
                else setLogin(true);
            })
    }

    const valueHandle = (e) => {
        setTitle(e.target.value);
    }

    const bbsListInsert = (img, tag) => {
        const url = '/board/bbsListInsert';
        const data = {
            bbsTitle: title,
            bbsContent: html,
            bbsImage: img,
            hashTag : tag
        };
        return axios.post(url, data, { withCredentials: true });
    }

    const bbsWriteSubmit = (img, tag) => {     
        bbsListInsert(img, tag)
            .then((response) => {
                console.log(response.data);
                if (response.data === true) {
                    alert("글쓰기 성공");
                }
                else {
                    alert("글쓰기 실패");
                }
                props.tabBarhandle("home")
            })
    }

    const bbsUpdate = (img, tag) => {
        const url = '/board/bbsUpdate';
        const data = {
            bbsTitle: title,
            bbsContent: html,
            bbsID:bbsID,
            bbsImage: img,
            hashTag : tag
        };
        return axios.post(url, data, { withCredentials: true });
    }

    const bbsUpdateSubmit = (img, tag) =>{
        bbsUpdate(img, tag)
            .then((response) => {
                console.log(response.data);
                if (response.data !== false) {
                    alert("글수정 성공");
                    
                }
                else {
                    alert("글수정 실패");

                }
                navigate(-1);
            })
    }

    const nextstep = () => {
        if (title == '') titleref.current.focus();
        else if(html == '') quillRef.current.focus();
        else setactive(true);
    }

    const imageHandler = () => {
        console.log('에디터에서 이미지 버튼을 클릭하면 이 핸들러가 시작됩니다!');
        // 1. 이미지를 저장할 input type=file DOM을 만든다.
        const input = document.createElement('input');
        // 속성 써주기
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click(); // 에디터 이미지버튼을 클릭하면 이 input이 클릭된다.

        input.addEventListener('change', async () => {
            const file = input.files[0];
            // multer에 맞는 형식으로 데이터 만들어준다.
            const formData = new FormData();
            formData.append('img', file); // formData는 키-밸류 구조
            // 백엔드 multer라우터에 이미지를 보낸다.
            try {
                const result = await axios.post('/board/bbsContentImage', formData , { withCredentials: true });
                const IMG_URL = result.data.url;
                
                const editor = quillRef.current.getEditor(); // 에디터 객체 가져오기
                
                const range = editor.getSelection();
                
                editor.insertEmbed(range.index, 'image', IMG_URL);
            } catch (error) {
                console.log('실패했어요ㅠ');
            }
        });
    };

    const modules = useMemo(() => {
        return {
            toolbar: {
                container: [
                    ['image'],
                    [{ header: [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                ],
                handlers: {
                    // 이미지 처리는 우리가 직접 imageHandler라는 함수로 처리할 것이다.
                    image: imageHandler,
                },
            },
        };
    }, []);

    const formats = [
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'align',
        'image',
    ];

    return (
        isLogin ? (
            <div className='write-container' style={{marginTop: isUpdate ? '150px' : null}}>
                <div className='write-content'>
                    <div style={{width: '80%', marginLeft: '10%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h3 style={{ fontWeight: 'bolder', marginBottom: '20px' }}>
                            {isUpdate === false ? '글쓰기': '글수정'}
                        </h3>
                        <input ref={titleref} value={title} onChange={valueHandle} placeholder='제목을 입력해주세요' style={{ width: '100%', height: '40px', marginBottom: '10px' }}></input>
                        <div style={{ background: 'white', width: '100%' }}>
                            <ReactQuill
                                ref={quillRef}
                                onChange={setHtml}
                                modules={modules}
                                formats={formats}
                                value={html}
                                placeholder={'내용을 입력해주세요 '}
                                theme="snow"
                            />
                        </div>
                        <div style={{ marginLeft: 'auto' }}>
                            {isUpdate === false ? 
                            <Button onClick={nextstep} variant="dark" style={{ marginTop: '10px' }}>글쓰기</Button> :
                            <Button onClick={nextstep} variant="dark" style={{ marginTop: '10px' }}>글수정</Button>}
                        </div>
                    </div>
                </div>
                <BoardWriteModal
                    img={img}
                    tag={tag}
                    setactive={setactive}
                    active = {active}
                    setimg = {setimg}
                    settag = {settag}
                    bbsWriteSubmit={bbsWriteSubmit}
                    isUpdate={isUpdate}
                    bbsUpdateSubmit={bbsUpdateSubmit}/>
            </div>
        ) : <div></div>
    );
}

export default BoardWrite;