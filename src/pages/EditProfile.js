
const EditProfile = () => {
  return `
    <main class="bg-[#F5F5F5] min-h-screen py-12 px-4 flex justify-center">
      <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl">
        <div class="text-center mb-6">
          <img src="assets/avatar.png" alt="Edit Profile" class="w-20 h-20 mx-auto mb-4" />
          <h2 class="text-2xl font-semibold text-gray-800">Edit Profile</h2>
          <p class="text-sm text-gray-600">Update your account information below. Fields marked with * are required.</p>
        </div>
        <form class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Full name*</label>
            <input type="text" class="mt-1 w-full p-3 border rounded-md" placeholder="Enter your full name" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email address*</label>
            <input type="email" class="mt-1 w-full p-3 border rounded-md" placeholder="your@email.com" />
          </div>
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700">Current password*</label>
              <input type="password" class="mt-1 w-full p-3 border rounded-md" placeholder="Enter current password" />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700">New password</label>
              <input type="password" class="mt-1 w-full p-3 border rounded-md" placeholder="Enter new password" />
            </div>
          </div>
          <button type="submit" class="w-full bg-black text-white py-3 rounded-md hover:opacity-90 transition">Save Changes</button>
        </form>
      </div>
    </main>
  `;
};

export default EditProfile;
