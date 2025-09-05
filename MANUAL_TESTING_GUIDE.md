# 🧪 Manual Testing Guide for J.I. HVAC Website

## 🚀 **Testing Environment**
- **URL:** http://localhost:3000
- **Status:** ✅ Development server is running

---

## 📋 **Test Checklist**

### **1. 🏠 Home Page Test**
- [ ] **Visit:** http://localhost:3000
- [ ] **Verify:** Page loads without errors
- [ ] **Check:** All videos play correctly
- [ ] **Test:** Navigation menu works
- [ ] **Confirm:** Responsive design on mobile/desktop

### **2. 📞 Contact Form Test**
- [ ] **Navigate to:** `/contact`
- [ ] **Fill out form:**
  - Name: "Test Customer"
  - Email: "test@example.com"
  - Phone: "416-555-0123"
  - Message: "This is a test contact form submission"
- [ ] **Submit form**
- [ ] **Verify:** Success message appears
- [ ] **Check Supabase:** Data appears in `contacts` table

### **3. 🔧 Service Request Form Test**
- [ ] **Navigate to:** `/services`
- [ ] **Fill out form:**
  - Name: "Test Service"
  - Email: "service@example.com"
  - Phone: "416-555-0124"
  - Address: "123 Test Street, Toronto, ON"
  - Service Type: "Fan Coil"
  - Description: "Test service request"
- [ ] **Submit form**
- [ ] **Verify:** Success message appears
- [ ] **Check Supabase:** Data appears in `service_requests` table

### **4. 🚨 Emergency Form Test**
- [ ] **Navigate to:** `/emergency`
- [ ] **Fill out form:**
  - Name: "Test Emergency"
  - Email: "emergency@example.com"
  - Phone: "416-555-0125"
  - Address: "456 Emergency Ave, Toronto, ON"
  - Issue: "Test emergency HVAC issue"
- [ ] **Submit form**
- [ ] **Verify:** Success message appears
- [ ] **Check Supabase:** Data appears in `emergency_requests` table

### **5. 🧾 Invoice Generator Test**
- [ ] **Navigate to:** `/invoice-generator`
- [ ] **Login:** Use admin credentials
- [ ] **Create New Invoice:**
  - Customer Name: "Test Customer"
  - Customer Email: "customer@example.com"
  - Customer Phone: "416-555-0126"
  - Customer Address: "789 Invoice St, Toronto, ON"
  - Due Date: Set to future date
- [ ] **Add Invoice Item with Bullet Points:**
  ```
  • Fan coil installation
  • Air filter replacement
  • System testing
  ```
- [ ] **Test Bullet Point Features:**
  - Press Enter to auto-add bullet points
  - Use "Format Bullet Points" button
  - Add multiple lines with bullet points
- [ ] **Save Invoice**
- [ ] **Verify:** Invoice appears in history
- [ ] **Test PDF Download**
- [ ] **Check Supabase:** Data appears in `Invoices` and `InvoiceItems` tables

### **6. 📱 Mobile Responsiveness Test**
- [ ] **Open DevTools** (F12)
- [ ] **Toggle device toolbar** (mobile view)
- [ ] **Test all pages** on mobile layout
- [ ] **Verify:** Forms work on mobile
- [ ] **Check:** Touch interactions work

### **7. 🖨️ Print/PDF Test**
- [ ] **Generate invoice** with bullet points
- [ ] **Download PDF**
- [ ] **Verify:** Bullet points appear correctly
- [ ] **Check:** Professional formatting
- [ ] **Confirm:** No "Status: Draft" in PDF

---

## 🔍 **Supabase Database Verification**

### **Check Tables in Supabase Dashboard:**
1. **Go to:** https://supabase.com/dashboard
2. **Select your project**
3. **Navigate to:** Table Editor
4. **Verify these tables exist:**
   - ✅ `contacts`
   - ✅ `service_requests`
   - ✅ `emergency_requests`
   - ✅ `Invoices`
   - ✅ `InvoiceItems`

### **Check Data After Testing:**
- [ ] **contacts table:** Has test contact form data
- [ ] **service_requests table:** Has test service request data
- [ ] **emergency_requests table:** Has test emergency data
- [ ] **Invoices table:** Has test invoice data
- [ ] **InvoiceItems table:** Has test invoice items with bullet points

---

## 🐛 **Common Issues & Solutions**

### **Issue: Forms not saving**
- **Solution:** Check Supabase API keys in environment
- **Check:** Browser console for errors

### **Issue: Invoice not creating**
- **Solution:** Verify admin login credentials
- **Check:** Service role key permissions

### **Issue: Bullet points not working**
- **Solution:** Ensure description field accepts multi-line input
- **Test:** Press Enter for auto-formatting

### **Issue: PDF not downloading**
- **Solution:** Check browser popup blockers
- **Alternative:** Use print preview

---

## ✅ **Success Criteria**

**All tests pass when:**
- [ ] All forms submit successfully
- [ ] Data appears in Supabase tables
- [ ] Invoice generator works with bullet points
- [ ] PDF downloads correctly
- [ ] Mobile responsiveness works
- [ ] No console errors

---

## 🚀 **Ready for Deployment**

**If all tests pass:**
1. ✅ Database tables are working
2. ✅ All forms are functional
3. ✅ Invoice system is operational
4. ✅ Bullet points are working
5. ✅ Mobile responsive design works

**You can now deploy to production!** 🎉

---

## 📞 **Need Help?**

If any tests fail:
1. Check browser console for errors
2. Verify Supabase connection
3. Check environment variables
4. Review database policies 