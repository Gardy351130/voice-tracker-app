
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star, Heart, Trophy, Target } from 'lucide-react';

const DailyMotivationPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [todaysMessage, setTodaysMessage] = useState('');

  const motivationalMessages = [
    "Great work today! Every expense tracked is a step towards financial freedom! 🌟",
    "You're building amazing money habits! Keep going! 💪",
    "Another day of smart budgeting! You should be proud! 🎉",
    "Consistency is key - and you're nailing it! Keep it up! ⭐",
    "Your future self will thank you for today's efforts! 🙌",
    "Small steps, big progress! You're doing fantastic! 🚀",
    "Financial awareness is financial power! Great job today! 💎",
    "You're taking control of your money story! Amazing work! 📈",
    "Every dollar tracked brings you closer to your goals! 🎯",
    "Building wealth one expense at a time! Keep going! 💰"
  ];

  const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
    return motivationalMessages[randomIndex];
  };

  const getRandomIcon = () => {
    const icons = [Star, Heart, Trophy, Target];
    const randomIndex = Math.floor(Math.random() * icons.length);
    return icons[randomIndex];
  };

  const checkForEndOfDay = () => {
    const now = new Date();
    const lastShown = localStorage.getItem('lastMotivationShown');
    const today = now.toDateString();
    
    // Show popup if it's after 9 PM and we haven't shown it today
    if (now.getHours() >= 21 && lastShown !== today) {
      setTodaysMessage(getRandomMessage());
      setIsOpen(true);
      localStorage.setItem('lastMotivationShown', today);
    }
  };

  useEffect(() => {
    // Check immediately when component mounts
    checkForEndOfDay();
    
    // Check every 30 minutes
    const interval = setInterval(checkForEndOfDay, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const IconComponent = getRandomIcon();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 p-3 rounded-full">
              <IconComponent className="h-8 w-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Daily Motivation
          </DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4">
          <p className="text-lg text-slate-700 leading-relaxed">
            {todaysMessage}
          </p>
          <div className="border-t pt-4">
            <Button 
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
            >
              Thanks for the motivation! 🙌
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DailyMotivationPopup;
