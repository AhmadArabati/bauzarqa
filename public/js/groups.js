const groups = [
    {
        name: 'BAU Zarqa',
        link: 'https://chat.whatsapp.com/L4KJ6jiyKN0IPH3lT2pCmO'
    },
    {
        name: 'Medical Analysis 🔬',
        link: 'https://chat.whatsapp.com/DcKBA6FhohLJdCZrjlXSsT'
    },
    {
        name: 'كلية الزرقاء الجامعية (٢) 📚🖊️',
        link: 'https://chat.whatsapp.com/JpP6g3fBX7JH0jtN3S9h9L'
    },
    {
        name: 'طلاب التمريض/كلية الزرقاء الجامعية',
        link: 'https://chat.whatsapp.com/L9mVzxNoayAGEdUPwMbsFQ',
        image: 'طلاب التمريض كلية الزرقاء الجامعية'
    },
    {
        name: 'تخصص التمريض دبلوم 🩺💉',
        link: 'https://chat.whatsapp.com/JfBNEStueSy7AZbs7Nl07l'
    },
    {
        name: 'الطفيليات الطبية // الفصل الثاني',
        link: 'https://chat.whatsapp.com/D5Y6EJO5ckBFWh2kTyWBtz',
        image: 'الطفيليات الطبية الفصل الثاني'
    },
    {
        name: 'كل اشى مهم والقرارات الرسمية بخصوص الجامعه',
        link: 'https://chat.whatsapp.com/Cek6ymRYKZHCd0744WU3fY'
    },
    {
        name: 'استفسارات تخصص التمريض🩺🏥💉',
        link: 'https://chat.whatsapp.com/FnpELMC8zJy2X3oNN69MXV'
    },
    {
        name: 'فتح شعبة انسجة ح ث 10.30-11.30/لاب ح11.30-2.30',
        link: 'https://chat.whatsapp.com/GSZbOSNwe2p3u9qY2dM645'
    },
    {
        name: 'فتح شعبة سريرية ن ر 8.30-11',
        link: 'https://chat.whatsapp.com/I5hmy8U8MYcDlUUo2LVnhN'
    },
    {
        name: 'بيولوجيا جزيئية// الفصل الثاني// بدون دكتور',
        link: 'https://chat.whatsapp.com/F7KWlHNQyr3FSM8qpi0UUV',
        image: 'بيولوجيا جزيئية الفصل الثاني بدون دكتور'
    },
    {
        name: 'دم (2)',
        link: 'https://chat.whatsapp.com/Kb9Oo6XzAbLJcBUXInrlNY'
    },
    {
        name: 'غدد',
        link: 'https://chat.whatsapp.com/ERo7Besr46NFK8L6O8oVl9'
    },
    {
        name: 'انجليزي (2)',
        link: 'https://chat.whatsapp.com/FbcGi8kPisSJIqjnI6WQR5'
    },
    {
        name: 'عسكرية',
        link: 'https://chat.whatsapp.com/HdnTTdxtF5n7HrTR3b1Tln'
    },
    {
        name: 'انجليزي ١',
        link: 'https://chat.whatsapp.com/BuJQuvg7xvW6st4NisFXzo'
    },
    {
        name: 'تشخيصية',
        link: 'https://chat.whatsapp.com/KApBOE9zQIqBHRHeGMPujm'
    },
    {
        name: 'حاسوب ٢',
        link: 'https://chat.whatsapp.com/EMriHNsTg8E08Nie9jLZFj'
    },
    {
        name: 'بنك دم',
        link: 'https://chat.whatsapp.com/CZ16Zjxq97fCk0VpqXXuEz'
    },
    {
        name: 'مايكرو طبية (الدكتور معاذ)',
        link: 'https://chat.whatsapp.com/KieB6pbKCocBJbXu0ig3hJ'
    },
    {
        name: 'دم ١ فصل ثاني (د.سكينه)',
        link: 'https://chat.whatsapp.com/Jfaqg29GfNF0T96iO6QrDZ',
    },
    {
        name: 'إحصاء حيوي طبي (د.عمر)',
        link: 'https://chat.whatsapp.com/HX1qWrmk2Fb2lPgw0w7wgS'
    },
    {
        name: 'انقليزي ١ فصل ثاني (د.تماره)',
        link: 'https://chat.whatsapp.com/Bo55exSil8fEHx0CIQJExM'
    },
    {
        name: 'حيويه فصل ثاني (د.احمد)/بكالوريوس',
        link: 'https://chat.whatsapp.com/JBET9jOePVMEiHrHxmJR3F',
        image: 'حيويه فصل ثاني (د.احمد) بكالوريوس'
    },
    {
        name: 'طحالب فصل ثاني',
        link: 'https://chat.whatsapp.com/FLsuOFmU6EV7aMC3rT07P9'
    },
    {
        name: 'Physiology (بيو+مايكرو)',
        link: 'https://chat.whatsapp.com/CNKiHNqfSO9JZWFFx8iOad'
    },
    {
        name: 'الكيمياء الحيوية العامة عملي//بكالوريوس د. ريما طه',
        link: 'https://chat.whatsapp.com/K5j0ZCJgI1GEdnl3MNpOht',
        image: 'الكيمياء الحيوية العامة عملي بكالوريوس د. ريما طه'
    },
    {
        name: 'اضطرابات سلوكية وانفعاليه دكتوره اسراء',
        link: 'https://chat.whatsapp.com/EWgBhPKi9yE63WjE0SpV09'
    },
    {
        name: 'تنميه مهارات حياتية دكتوره اسلام',
        link: 'https://chat.whatsapp.com/Bg6jU3HcxUc29y64acbN4w'
    },
    {
        name: 'المواطنة الإيجابية || شعبة 3',
        link: 'https://chat.whatsapp.com/B82KT4yQcBsHR1Emo6ZIoM',
        image: 'المواطنة الإيجابية شعبة 3'
    },
    {
        name: 'Anatomy (dr.Saddam Al-Khalayleh)',
        link: 'https://chat.whatsapp.com/LbOrue1uPxg4GwsfioOmmQ'
    },
    {
        name: 'شعبة عملي و نظري',
        link: 'https://chat.whatsapp.com/C1EX9ug2BWE62oq2aI7P7k'
    }
    // {
    //     name: 'BAU Zarqa',
    //     link: 'https://chat.whatsapp.com/L4KJ6jiyKN0IPH3lT2pCmO'
    // },
];