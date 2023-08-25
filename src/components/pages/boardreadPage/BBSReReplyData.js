
function BBSReReplyData(props) {
    return (
        <div style={{ borderBottom: '1px solid #999', marginBottom: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', fontSize: '1.2em' }}>
                <div>
                    {props.id}
                </div>
                <div style={{ marginLeft: '50px', fontWeight: 'bold' }}>
                    └ {props.content}
                </div>
            </div>
        </div>     
    )
}

export default BBSReReplyData;