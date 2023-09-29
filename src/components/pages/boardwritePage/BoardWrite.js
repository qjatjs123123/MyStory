import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function BoardWrite(props) {
    const [isUpdate, setisUpdate] = useState(props.update);
    const [bbsID, setbbsID] = useState(props.bbsID);
    const [html, setHtml] = useState(props.bbsContent);
    const [title, setTitle] = useState(props.bbsTitle);
    const quillRef = useRef(null);
    const navigate = useNavigate();
    const [isLogin, setLogin] = useState(false);

    useEffect(() => {
        loginCheckSubmit();
        console.log(props.update, props.bbsID, props.bbsContent, props.bbsTitle);
    }, []);

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

    const bbsListInsert = () => {
        const url = '/board/bbsListInsert';
        const data = {
            bbsTitle: title,
            bbsContent: html
        };
        return axios.post(url, data, { withCredentials: true });
    }

    const bbsWriteSubmit = () => {
        bbsListInsert()
            .then((response) => {
                console.log(response.data);
                if (response.data === true) {
                    alert("글쓰기 성공");
                    navigate('/board');
                }
                else {
                    alert("글쓰기 실패");
                    navigate('/board');
                }
            })
    }

    const bbsUpdate = () => {
        const url = '/board/bbsUpdate';
        const data = {
            bbsTitle: title,
            bbsContent: html,
            bbsID:bbsID
        };
        return axios.post(url, data, { withCredentials: true });
    }

    const bbsUpdateSubmit = () =>{
        bbsUpdate()
            .then((response) => {
                console.log(response.data);
                if (response.data !== false) {
                    alert("글수정 성공");
                    navigate('/board');
                }
                else {
                    alert("글수정 실패");
                    navigate('/board');
                }
            })
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
                const result = await axios.post('/board/bbsContentImage', formData);
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
            <div style={{ width: '80%', marginLeft: '10%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ marginTop: '50px', fontWeight: 'bolder', marginBottom: '20px' }}>
                    {isUpdate === false ? '글쓰기': '글수정'}
                </h3>
                <input value={title} onChange={valueHandle} placeholder='제목을 입력해주세요' style={{ width: '100%', height: '40px', marginBottom: '10px' }}></input>
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
                    <Button onClick={bbsWriteSubmit} variant="dark" style={{ marginTop: '10px' }}>글쓰기</Button> :
                    <Button onClick={bbsUpdateSubmit} variant="dark" style={{ marginTop: '10px' }}>글수정</Button>}
                </div>
            </div>
        ) : <div></div>
    );
}

export default BoardWrite;