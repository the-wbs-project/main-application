using Auth0.ManagementApi.Models;
using Wbs.Core.DataServices;
using Wbs.Core.ViewModels;

namespace Wbs.Core.Services.Transformers;

public class UserTransformer : SqlHelpers
{
    public static List<UserViewModel> ToViewModelList(IEnumerable<User> users)
    {
        var results = new List<UserViewModel>();

        foreach (var user in users)
            results.Add(ToViewModel(user));

        return results;
    }

    public static UserViewModel ToViewModel(User user)
    {
        return new UserViewModel
        {
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt,
            Email = user.Email,
            FullName = user.FullName,
            LastLogin = user.LastLogin,
            LinkedIn = user.UserMetadata?.linkedIn,
            LoginCount = int.Parse(user.LoginsCount ?? "0"),
            Phone = user.PhoneNumber,
            Picture = user.Picture,
            Title = user.UserMetadata?.title,
            Twitter = user.UserMetadata?.twitter,
            UserId = user.UserId,
            ShowExternally = user.UserMetadata?.showExternally == null ? [] : user.UserMetadata?.showExternally.ToObject<string[]>(),
        };
    }

    public static UserUpdateRequest ToUpdateUserRequest(UserViewModel viewModel)
    {
        return new UserUpdateRequest
        {
            AppMetadata = new { },
            UserMetadata = new
            {
                title = viewModel.Title,
                linkedIn = viewModel.LinkedIn,
                twitter = viewModel.Twitter,
                showExternally = viewModel.ShowExternally,
            },
            FullName = viewModel.FullName
        };
    }
}