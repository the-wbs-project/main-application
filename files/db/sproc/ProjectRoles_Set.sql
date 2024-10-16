DROP PROCEDURE IF EXISTS [dbo].[ProjectRoles_Set]
GO

CREATE PROCEDURE [dbo].[ProjectRoles_Set]
    @ProjectId NVARCHAR(100),
    @UserRoles NVARCHAR(MAX)
AS
BEGIN
    DELETE [dbo].[ProjectRoles]
    WHERE [ProjectId] = @ProjectId

    INSERT INTO [dbo].[ProjectRoles] ([ProjectId], [UserId], [Role])
    SELECT
        @ProjectId,
        JSONData.UserId,
        JSONData.Role
    FROM OPENJSON(@UserRoles)
    WITH (
        UserId NVARCHAR(100) '$.UserId',
        Role NVARCHAR(100) '$.Role'
    ) AS JSONData
END
GO