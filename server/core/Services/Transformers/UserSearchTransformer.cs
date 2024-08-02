using Auth0.ManagementApi.Models;
using Wbs.Core.Models.Search;
using Wbs.Core.ViewModels;

namespace Wbs.Core.Services.Transformers;

public static class UserSearchTransformer
{
    public static UserOrganizationDocument CreateDocument(
        Organization organization,
        User user,
        string[] roles,
        string visibility)
    {
        if (visibility == "organization")
        {
            return new UserOrganizationDocument
            {
                Id = UserOrganizationDocument.CreateId(organization.Name, user.UserId, "organization"),
                UserId = user.UserId,
                OrgId = organization.Id,
                OrgName = organization.Name,
                OrgDisplayName = organization.DisplayName,
                Visibility = "organization",
                FullName = user.FullName,
                Email = user.Email,
                Title = user.UserMetadata?.Title,
                Phone = user.UserMetadata?.Phone,
                Picture = user.Picture,
                CreatedAt = user.CreatedAt,
                LastLogin = user.LastLogin,
                LoginCount = user.LoginsCount,
                Roles = roles,
                LinkedIn = user.UserMetadata?.LinkedIn,
                Twitter = user.UserMetadata?.Twitter
            };
        }
        string[] showExternally = (user.UserMetadata?.ShowExternally ?? "").Split(",");

        return new UserOrganizationDocument
        {
            Id = UserOrganizationDocument.CreateId(organization.Name, user.UserId, "public"),
            UserId = user.UserId,
            OrgId = organization.Id,
            OrgName = organization.Name,
            OrgDisplayName = organization.DisplayName,
            Visibility = "public",
            FullName = user.FullName,
            Picture = user.Picture,
            CreatedAt = user.CreatedAt,
            LastLogin = user.LastLogin,
            LoginCount = user.LoginsCount,
            Roles = roles,
            Email = showExternally.Contains("email") ? user.Email : "private",
            Phone = showExternally.Contains("phone") ? user.PhoneNumber : "private",
            Title = showExternally.Contains("title") ? user.UserMetadata?.Title : "private",
            LinkedIn = showExternally.Contains("linkedIn") ? user.UserMetadata?.LinkedIn : "private",
            Twitter = showExternally.Contains("twitter") ? user.UserMetadata?.Twitter : "private",
        };

    }

    public static UserViewModel ToViewModel(UserOrganizationDocument doc)
    {
        return new UserViewModel
        {
            UserId = doc.UserId,
            Phone = doc.Phone,
            LinkedIn = doc.LinkedIn,
            Twitter = doc.Twitter,
            Picture = doc.Picture,
            CreatedAt = doc.CreatedAt,
            LastLogin = doc.LastLogin,
            LoginCount = doc.LoginCount,
            Email = doc.Email,
            Title = doc.Title,
            FullName = doc.FullName,
            Roles = doc.Roles
        };
    }

}