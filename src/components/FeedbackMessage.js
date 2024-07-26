

export default function FeedbackMessage(props) {
    const openFeedbackForm = props.openFeedbackForm;
    const feedbackId = props.feedbackId;
  
    const clickOpenFeedbackForm = () => {
        openFeedbackForm(feedbackId);
    }

    return (
        <div className="w-full h-full">
            Could you help us understand what we can improve?
            <a onClick={clickOpenFeedbackForm} className="block py-2 mt-3 text-[#673A95] cursor-pointer">Open Feedback Form</a>
        </div>
    )
}