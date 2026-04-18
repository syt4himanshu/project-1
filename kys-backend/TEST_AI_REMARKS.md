# Testing AI Remarks Assistant

## Prerequisites

1. **Environment Variable Set**
   ```bash
   # In kys-backend/.env
   GROQ_API_KEY=your_actual_groq_api_key_here
   ```

2. **Backend Running**
   ```bash
   cd kys-backend
   npm start
   ```

3. **Frontend Running**
   ```bash
   cd kys-frontend
   npm run dev
   ```

## Test Steps

### 1. Login as Faculty
- Navigate to: `http://localhost:5173`
- Login with faculty credentials
- Should redirect to faculty dashboard

### 2. Navigate to Student
- Click "Mentees" in navigation
- Select any student from the list
- Should open the mentee detail page

### 3. Open AI Assistant
- Click the **"✨ AI Assistant"** button
- Popup should open with:
  - Student name, semester, program in header
  - 4 suggestion chips visible
  - Greeting message displayed
  - Input field focused

### 4. Test Suggestion Chip
- Click **"📊 Performance Feedback"** chip
- Should see:
  - User message appears (right side, purple)
  - Loading indicator appears
  - After 2-3 seconds, AI response appears (left side, gray)
  - "Insert into Remarks Form" button appears

### 5. Test Custom Query
- Type: "What are the student's strengths?"
- Click send button (or press Enter)
- Should see:
  - User message appears
  - Loading indicator
  - AI response
  - Insert button

### 6. Test Insert Functionality
- Click **"✓ Insert into Remarks Form"** button
- Should:
  - Close the AI assistant popup
  - Fill the remarks form with AI-generated content
  - Remarks field populated
  - Suggestion field populated (if available)
  - Action field populated (if available)

### 7. Test Error Handling
- Temporarily stop backend
- Try sending a message
- Should see red error message: "Failed to get AI response"

### 8. Test Keyboard Navigation
- Press **Tab** - should cycle through interactive elements
- Press **Escape** - should close popup
- Press **Enter** in input - should send message

## Expected API Flow

### Request
```bash
curl -X POST http://localhost:5002/api/faculty/ai-remarks \
  -H "Content-Type: application/json" \
  -H "Cookie: your_auth_cookie" \
  -d '{
    "query": "Generate performance feedback",
    "studentContext": {
      "uid": "STU001",
      "name": "John Doe",
      "semester": 4,
      "program": "Computer Science"
    }
  }'
```

### Response (Success)
```json
{
  "success": true,
  "data": {
    "content": "Performance Overview:\nJohn demonstrates consistent effort...\n\nSuggestions:\nFocus on improving...\n\nAction Plan:\nSchedule weekly...",
    "studentUid": "STU001",
    "timestamp": "2026-04-18T10:30:00.000Z"
  }
}
```

### Response (Error - No API Key)
```json
{
  "success": false,
  "error": "Missing GROQ_API_KEY"
}
```

### Response (Error - Unauthorized)
```json
{
  "success": false,
  "error": "Student not found or not assigned to this faculty"
}
```

## Backend Logs to Check

When testing, check backend console for:

```
✅ Good logs:
[INFO] AI Remarks Request Initiated { studentUid: 'STU001' }
Groq Model: llama-3.3-70b-versatile
Latency: 2341 ms
[INFO] AI Remarks Generated Successfully { studentUid: 'STU001' }

❌ Error logs:
[ERROR] AI Remarks Generation Error { error: 'Missing GROQ_API_KEY' }
[ERROR] Groq API Error: Invalid GROQ_API_KEY
```

## Common Issues & Solutions

### Issue 1: "Failed to get AI response"
**Cause**: GROQ_API_KEY not set or invalid
**Solution**: 
```bash
# Check .env file
cat kys-backend/.env | grep GROQ_API_KEY

# Should output: GROQ_API_KEY=gsk_...
# If not, add it to .env file
```

### Issue 2: "Student not found or not assigned to this faculty"
**Cause**: Student UID doesn't match or not assigned to logged-in faculty
**Solution**: 
- Verify student is assigned to the faculty in database
- Check student UID is correct

### Issue 3: Popup doesn't open
**Cause**: CSS not imported or state not updating
**Solution**:
- Check browser console for errors
- Verify CSS import in FacultyMenteeDetailPage.tsx
- Check React DevTools for state changes

### Issue 4: Insert button doesn't appear
**Cause**: AI response not parsed correctly
**Solution**:
- Check browser console for parsing errors
- Verify AI response format
- Check `parseAIResponse` function

### Issue 5: Rate limit exceeded
**Cause**: Too many requests in short time
**Solution**:
- Wait 60 seconds
- Rate limiter resets automatically

## Verification Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can login as faculty
- [ ] Can navigate to student page
- [ ] AI Assistant button visible
- [ ] Popup opens correctly
- [ ] Student context displays
- [ ] Suggestion chips work
- [ ] Custom queries work
- [ ] AI responses appear
- [ ] Insert button works
- [ ] Content fills form
- [ ] Error handling works
- [ ] Keyboard navigation works
- [ ] Popup closes correctly

## Success Criteria

✅ **All tests pass**
✅ **No console errors**
✅ **AI responses in <3 seconds**
✅ **Faculty can complete workflow in <30 seconds**
✅ **Error messages are user-friendly**
✅ **Keyboard navigation works**

## Next Steps After Testing

1. Gather faculty feedback
2. Monitor API usage and latency
3. Optimize prompts based on response quality
4. Add analytics tracking
5. Consider adding more suggestion chips
6. Implement conversation history (future)

---

**Note**: This implementation uses the same Groq service and pattern as the working faculty chatbot, ensuring consistency and reliability.
