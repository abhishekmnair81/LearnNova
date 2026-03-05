import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate } from '@fortawesome/free-solid-svg-icons';

const StudentLoginIcon = ({ size = '2x', color = 'currentColor' }) => (
  <FontAwesomeIcon icon={faUserGraduate} size={size} color={color} />
);

export default StudentLoginIcon;