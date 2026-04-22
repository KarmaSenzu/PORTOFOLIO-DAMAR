import { motion } from 'framer-motion';
import './SkillCard.css';

const SkillCard = ({ skill, index = 0 }) => {
    return (
        <motion.div
            className="skill-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ scale: 1.05, y: -4 }}
        >
            <div className="skill-card__icon" style={{ color: skill.color }}>
                {skill.icon}
            </div>
            <span className="skill-card__name">{skill.name}</span>
        </motion.div>
    );
};

export default SkillCard;
