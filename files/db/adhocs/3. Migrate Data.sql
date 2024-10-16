/*
    Migrate Project Roles
*/

INSERT INTO [dbo].[ProjectRoles]
    ([ProjectId], [UserId], [Role])
SELECT
    p.[Id] as ProjectId,
    JSONData.[userId],
    CASE JSONData.[role]
        WHEN 'rol_12jH9Osuw8nL4YV9' THEN 'pm'
        WHEN 'rol_7KwO50jAIV67tqX0' THEN 'admin'
        WHEN 'rol_vvEl0ctJiZHVoGP3' THEN 'approver'
        WHEN 'rol_Ee7HoMw07f91vljJ' THEN 'sme'
    ELSE null
    END as Role
FROM
    [dbo].[Projects] p
    CROSS APPLY OPENJSON(p.[Roles])
    WITH (
        [role] NVARCHAR(100) '$.role',
        [userId] NVARCHAR(100) '$.userId'
    ) AS JSONData;

/*
    Migrate Library Entry Version Editors
*/

INSERT INTO [dbo].[LibraryEntryVersionEditors]
SELECT
    p.[EntryId],
    p.[Version],
    JSONData.[value]
FROM
    [dbo].[LibraryEntryVersions] p
    CROSS APPLY OPENJSON(p.[Editors]) AS JSONData;




