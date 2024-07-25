import Image from "next/image"
import icon from '../../../../public/send-icon.png';
const SendButton = ({ sendMessage }) => {

  return(
    <button className='button-send-message' onClick={sendMessage}>
      <Image
        className='send-icon'
        src={icon}
        width={25}
        height={25}
        alt="Send"
      />
  </button>
  )
}

export default SendButton