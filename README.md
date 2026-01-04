# 💜 Love Languages Assessment

A beautiful, interactive web application to discover how you give and receive love in intimate relationships. Built with React, TypeScript, and modern UI components.

![Love Languages Assessment](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-646cff?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06b6d4?style=for-the-badge&logo=tailwindcss)

## ✨ Features

### 🎯 Comprehensive Assessment
- **30 Thoughtfully Crafted Questions** - Realistic scenarios from long-term relationships
- **Separate Giving & Receiving Scores** - Understand how you express love vs. how you feel loved
- **Intensity-Based Scoring** - Questions test how strongly you resonate with each language
- **Smart Question Design** - Multidimensional responses with hidden comparison questions

### 🎨 Beautiful User Experience
- **Gorgeous Modern UI** - Gradient designs, smooth animations, and delightful interactions
- **Keyboard Shortcuts** - Press 1-5 to select answers, ← for previous question
- **Auto-Advance** - Seamlessly moves to next question after selection
- **Visual Progress** - Animated dots show your journey through the assessment
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile

### 📊 Deep Insights
- **Detailed Analysis** - Comprehensive breakdown of all 5 love languages
- **Personalized Content** - Results tailored to YOUR specific score palette
- **Receiving vs Giving** - Toggle between how you receive and give love
- **Side-by-Side Comparison** - See all your scores at a glance
- **Intensity Levels** - High/Medium/Low classifications with percentages

### 💑 Partner Compatibility
- **Compatibility Analysis** - See how your languages align with your partner's
- **Visual Flow Diagrams** - Beautiful visualization of love language dynamics
- **Specific Guidance** - Tailored advice for your unique pairing
- **Bridge Strategies** - Concrete ways to overcome language mismatches
- **Couple Activities** - Recommended exercises based on your profiles

### 🎯 Actionable Growth
- **Personal Exercises** - Solo activities for each love language
- **Growth Opportunities** - Specific areas for development
- **Common Triggers** - What to watch out for in relationships
- **Strengths & Challenges** - Understand your unique profile

### 💾 Save & Share
- **Auto-Save Progress** - Never lose your place (7-day localStorage)
- **Export Progress** - Download as custom `.love` file
- **Import Progress** - Resume from any saved point
- **Export Results as PDF** - Professional document format
- **Export as JPG** - Single image or multiple slides
- **Share Your Results** - Perfect for discussing with your partner

## 🚀 Live Demo

**[Try it now →](https://your-app-url.vercel.app)**

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite 7
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS V4
- **UI Components**: ShadCN 3.7
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **PDF Export**: jsPDF + html2canvas

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn

## 🏃‍♂️ Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/jorrikklijnsma/love-language.git

# Navigate to project directory
cd love-language

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
love-language/
├── public/
│   ├── questionnaire.json    # 30 questions with giving/receiving context
│   └── conclusions.json       # Detailed insights and activities
├── src/
│   ├── components/
│   │   ├── ui/               # ShadCN components
│   │   ├── IntroScreen.tsx   # Welcome screen
│   │   ├── QuestionScreen.tsx # Question display with keyboard nav
│   │   ├── ResultsScreen.tsx  # Comprehensive results dashboard
│   │   ├── SaveLoadModal.tsx  # Save/load functionality
│   │   └── ExportResultsModal.tsx # PDF/JPG export
│   ├── lib/
│   │   └── utils.ts          # Utility functions
│   ├── types.ts              # TypeScript definitions
│   ├── App.tsx               # Main application component
│   └── main.tsx              # Application entry point
├── components.json           # ShadCN configuration
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🎮 Usage

### Taking the Assessment

1. **Start** - Click "Begin Assessment" on the intro screen
2. **Answer Questions** - Click options or press number keys (1-5)
3. **Navigate** - Use ← key to go back, auto-advances after selection
4. **Complete** - Answer all 30 questions to see your results

### Saving Progress

- **Auto-Save**: Progress automatically saved to browser storage
- **Manual Export**: Click "Save/Load Progress" → Download .love file
- **Resume**: Upload .love file to continue from where you left off

### Viewing Results

- **Toggle View**: Switch between "Receiving" and "Giving" modes
- **Explore Languages**: Click on any language card to see details
- **Partner Analysis**: Select partner's languages for compatibility insights
- **Export**: Download results as PDF or JPG images

## 🎨 Customization

### Modifying Questions

Edit `public/questionnaire.json`:

```json
{
  "id": 1,
  "text": "Your question here",
  "context": "receiving", // or "giving"
  "options": [
    {
      "text": "Option text",
      "language": "words", // words, quality_time, service, touch, gifts
      "weight": 3 // 0-3
    }
  ]
}
```

### Customizing Content

Edit `public/conclusions.json` to modify:

- Language descriptions and insights
- Solo activities and exercises
- Couple activities
- Compatibility analysis text

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with love and inspired by Gary Chapman's "The 5 Love Languages"
- UI components from [ShadCN](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)

## 📧 Contact

Jorrik - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/jorrikklijnsma/love-language](https://github.com/jorrikklijnsma/love-language)

---

Made with 💜 by Jorrik Klijnsma