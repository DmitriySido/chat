const InputMessage = ({ sendMessage, messageInputRef, setNewMessage, newMessage }) => {

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <input
      className='input-send-message'
      type="text"
      value={newMessage}
      placeholder='Broadcast a message'
      onChange={(e) => setNewMessage(e.target.value)}
      onKeyDown={handleKeyDown}
      ref={messageInputRef}
    />
  )
}

export default InputMessage