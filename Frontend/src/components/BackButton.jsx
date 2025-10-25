import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from './ui/Button';

const BackButton = ({ className }) => {
    const navigate = useNavigate();
    return (
        <Button variant="ghost" onClick={() => navigate(-1)} className={`${className || ''}`} aria-label="Quay lại">
            <ArrowLeft className="w-5 h-5" />
            Quay lại
        </Button>
    );
};

export default BackButton;
